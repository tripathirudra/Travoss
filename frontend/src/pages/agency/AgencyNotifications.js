import { Bell } from "lucide-react"

export default function AgencyNotifications() {
  const notifications = []

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-border shadow-lg p-6">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notif, idx) => (
              <div key={idx} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{notif.title}</h4>
                    <p className="text-sm text-foreground/70">{notif.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-foreground/60">
            <Bell size={48} className="mx-auto mb-4 opacity-50" />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  )
}

