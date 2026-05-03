"use client";

import WorkspaceCard from "./WorkspaceCard";

export default function WorkspaceList({ workspaces, onOpen, onManage, onDelete, openingWorkspaceId = "" }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {workspaces.map((workspace) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          onOpen={onOpen}
          onManage={onManage}
          onDelete={onDelete}
          opening={openingWorkspaceId === workspace.id}
        />
      ))}
    </div>
  );
}
