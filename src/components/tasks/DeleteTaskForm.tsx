"use client";

import { Button } from "@/components/ui/Button";

export function DeleteTaskForm({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("この作業を削除しますか？この操作は取り消せません。")) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger">
        削除する
      </Button>
    </form>
  );
}
