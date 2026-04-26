import { Bell, CheckCheck, Circle } from 'lucide-react';
import { mockNotifications } from '../lib/mockData';

export default function Notifications() {
  const unread = mockNotifications.filter((n) => !n.read_at);
  const read = mockNotifications.filter((n) => n.read_at);

  const formatDate = (d: string) =>
    new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Centre de notifications</h3>
            <p className="text-sm text-gray-500">{unread.length} non lue{unread.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        {unread.length > 0 && (
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors font-medium">
            <CheckCheck className="w-4 h-4" />
            Tout marquer comme lu
          </button>
        )}
      </div>

      {unread.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-5 py-3 bg-green-50 border-b border-green-100">
            <p className="text-sm font-semibold text-green-800">Non lues ({unread.length})</p>
          </div>
          <div className="divide-y divide-gray-50">
            {unread.map((notif) => (
              <div key={notif.id} className="px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4 cursor-pointer">
                <div className="flex-shrink-0 mt-1">
                  <Circle className="w-2.5 h-2.5 text-green-500 fill-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{notif.title}</p>
                  <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                  <p className="text-xs text-gray-400">{formatDate(notif.created_at!)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden opacity-75">
          <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-500">Lues ({read.length})</p>
          </div>
          <div className="divide-y divide-gray-50">
            {read.map((notif) => (
              <div key={notif.id} className="px-5 py-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-0.5">{notif.title}</p>
                  <p className="text-sm text-gray-400 mb-2">{notif.message}</p>
                  <p className="text-xs text-gray-300">{formatDate(notif.created_at!)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
