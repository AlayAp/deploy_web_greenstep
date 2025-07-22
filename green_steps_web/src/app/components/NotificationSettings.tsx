export default function NotificationSettings() {
  return (
    <div className="p-4 border rounded my-2 bg-white dark:bg-gray-800 dark:border-gray-700">
      <h2 className="font-semibold text-lg text-black dark:text-white">Notification Settings</h2>
      <p className="text-gray-800 dark:text-gray-200">Email Notifications: ON</p>
      <p className="text-gray-800 dark:text-gray-200">SMS Alerts: OFF</p>
    </div>
  );
}