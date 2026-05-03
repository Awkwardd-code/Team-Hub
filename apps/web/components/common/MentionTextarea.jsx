"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function getInitials(name) {
  return (name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function mentionTokenForMember(member) {
  const email = String(member?.email || "").trim().toLowerCase();
  if (email.includes("@")) return email.split("@")[0];
  const name = String(member?.name || "").trim().replace(/\s+/g, "");
  return name || "user";
}

export default function MentionTextarea({
  value,
  onChange,
  members = [],
  placeholder,
  rows = 4,
  className = "",
  onKeyDown,
}) {
  const wrapperRef = useRef(null);
  const textareaRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mention, setMention] = useState(null);

  const filteredMembers = useMemo(() => {
    if (!mention?.query && mention?.query !== "") return [];
    const q = mention.query.toLowerCase();
    return members.filter((member) => {
      const email = String(member.email || "").toLowerCase();
      const emailLocal = email.split("@")[0];
      const name = String(member.name || "").toLowerCase();
      const compactName = name.replace(/\s+/g, "");
      return !q || email.includes(q) || emailLocal.includes(q) || name.includes(q) || compactName.includes(q);
    });
  }, [members, mention]);

  useEffect(() => {
    function onPointerDown(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setMention(null);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  useEffect(() => {
    if (activeIndex >= filteredMembers.length) setActiveIndex(0);
  }, [filteredMembers.length, activeIndex]);

  function updateMentionFromCaret(nextValue) {
    const cursorPos = textareaRef.current?.selectionStart ?? nextValue.length;
    const left = nextValue.slice(0, cursorPos);
    const match = left.match(/(^|\s)@([A-Za-z0-9._@-]*)$/);
    if (!match) {
      setMention(null);
      return;
    }

    const token = match[2] || "";
    const start = cursorPos - token.length - 1;
    setMention({ start, end: cursorPos, query: token });
  }

  function handleInputChange(nextValue) {
    onChange(nextValue);
    updateMentionFromCaret(nextValue);
  }

  function applyMention(member) {
    if (!mention) return;
    const token = mentionTokenForMember(member);
    const inserted = `@${token}`;
    const nextValue = `${value.slice(0, mention.start)}${inserted} ${value.slice(mention.end)}`;
    onChange(nextValue);
    setMention(null);
    requestAnimationFrame(() => {
      const pos = mention.start + inserted.length + 1;
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(pos, pos);
    });
  }

  return (
    <div ref={wrapperRef} className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        rows={rows}
        placeholder={placeholder}
        className={className}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (mention && filteredMembers.length > 0) {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) => (prev + 1) % filteredMembers.length);
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((prev) => (prev - 1 + filteredMembers.length) % filteredMembers.length);
            } else if (e.key === "Enter") {
              e.preventDefault();
              applyMention(filteredMembers[activeIndex]);
            } else if (e.key === "Escape") {
              e.preventDefault();
              setMention(null);
            }
          }
          onKeyDown?.(e);
        }}
        onClick={(e) => updateMentionFromCaret(e.currentTarget.value)}
        onKeyUp={(e) => updateMentionFromCaret(e.currentTarget.value)}
      />

      {mention && filteredMembers.length > 0 ? (
        <div className="absolute z-30 mt-2 max-h-56 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900">
          {filteredMembers.map((member, index) => (
            <button
              key={member.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => applyMention(member)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left ${
                index === activeIndex ? "bg-violet-50 dark:bg-violet-900/30" : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {member.avatarUrl ? (
                <img src={member.avatarUrl} alt={member.name || member.email} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                  {getInitials(member.name || member.email)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{member.name || "User"}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{member.email}</p>
              </div>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
