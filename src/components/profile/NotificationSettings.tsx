"use client";

import { usePushNotification } from "@/hooks/usePushNotification";
import { FaBell, FaBellSlash, FaInfoCircle } from "react-icons/fa";

export default function NotificationSettings() {
  const { isEnabled, isSupported, enableNotifications, disableNotifications } =
    usePushNotification();

  if (!isSupported) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cài đặt thông báo
        </h3>
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <FaInfoCircle className="text-amber-600 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-800 font-medium">
              Trình duyệt không hỗ trợ
            </p>
            <p className="text-sm text-amber-700 mt-1">
              Trình duyệt của bạn không hỗ trợ thông báo đẩy. Vui lòng sử dụng
              Chrome, Firefox, hoặc Edge phiên bản mới nhất.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Cài đặt thông báo
      </h3>

      {/* Push Notification Toggle */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`p-2 rounded-lg ${
                isEnabled ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              {isEnabled ? (
                <FaBell className="text-blue-600 text-xl" />
              ) : (
                <FaBellSlash className="text-gray-400 text-xl" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">
                Thông báo đẩy
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Nhận thông báo về khóa học mới, bài học được cập nhật, bình
                luận và các hoạt động quan trọng
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={isEnabled ? disableNotifications : enableNotifications}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isEnabled ? "bg-blue-600" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={isEnabled}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Status Info */}
        {isEnabled && (
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FaInfoCircle className="text-green-600 text-sm flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800">
              Thông báo đã được bật. Bạn sẽ nhận được thông báo ngay cả khi
              không mở trang web.
            </p>
          </div>
        )}
      </div>

      {/* Additional Settings (Future) */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">
          Loại thông báo
        </h4>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              disabled={!isEnabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Khóa học mới</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              disabled={!isEnabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Bài học được cập nhật</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              disabled={!isEnabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Bình luận và trả lời</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              disabled={!isEnabled}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
            />
            <span className="text-sm text-gray-700">Thông báo hệ thống</span>
          </label>
        </div>
      </div>
    </div>
  );
}
