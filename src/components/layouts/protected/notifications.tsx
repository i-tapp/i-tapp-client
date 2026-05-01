"use client";

import { Wrapper } from "@/components/wrapper";
import { useFetchNotifications } from "@/queries";
import { markAllNotificationsRead, markNotificationRead } from "@/actions";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { Notification } from "iconsax-reactjs";
import { cn } from "@/utils/tailwind";

export default function NotificationPage() {
  const { data = [], isLoading } = useFetchNotifications();
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const { execute: markRead } = useAction(markNotificationRead, { onSuccess: invalidate });
  const { execute: markAll, isExecuting: isMarkingAll } = useAction(markAllNotificationsRead, { onSuccess: invalidate });

  const unread = data.filter((n) => !n.isRead);
  const read = data.filter((n) => n.isRead);

  if (isLoading) return <Wrapper><p className="text-sm text-gray-400">Loading...</p></Wrapper>;

  return (
    <Wrapper className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h6 className="text-h5">Notifications</h6>
        {unread.length > 0 && (
          <button
            disabled={isMarkingAll}
            onClick={() => markAll({})}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Mark all as read
          </button>
        )}
      </div>

      {data.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-10">No notifications yet.</p>
      )}

      {unread.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-base font-bold">Most recent</p>
          {unread.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={() => markRead({ id: n.id })} />
          ))}
        </div>
      )}

      {read.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-base font-bold">Earlier</p>
          {read.map((n) => (
            <NotificationItem key={n.id} notification={n} onRead={() => markRead({ id: n.id })} />
          ))}
        </div>
      )}
    </Wrapper>
  );
}

function NotificationItem({ notification, onRead }: { notification: any; onRead: () => void }) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition",
        notification.isRead ? "bg-white border-gray-100" : "bg-primary/5 border-primary/20",
      )}
      onClick={() => { if (!notification.isRead) onRead(); }}
    >
      <Notification size={20} className="shrink-0 mt-0.5 text-primary" />
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", !notification.isRead && "font-semibold")}>{notification.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{notification.body}</p>
        <p className="text-xs text-primary font-bold mt-1">{moment(notification.createdAt).fromNow()}</p>
      </div>
      {!notification.isRead && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
    </div>
  );
}
