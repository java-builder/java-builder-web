import { useState } from "react";
import { CreateCategoryRequest, CategoryType } from "@/types/category";
import { categoryService } from "@/services/category.service";
import toast from "react-hot-toast";

const ICONS = ["📘","📂","🏷️","📙","📗","📕","📒","🧩"];
const COLORS = ["#0284C7","#0EA5A4","#10B981","#F97316","#F43F5E","#8B5CF6","#F59E0B","#374151"];

export default function CreateCategoryModal({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess?: () => void; }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>(ICONS[0]);
  const [color, setColor] = useState<string>(COLORS[0]);
  const [categoryType, setCategoryType] = useState<CategoryType>(CategoryType.BLOG);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState("");

  const EMOJI_LIST = [
    // Code & Development
    "💻","🖥️","⌨️","🖱️","🧑‍💻","👨‍💻","👩‍💻","💾","📀","🖲️",
    // Tools & Settings
    "🛠️","🔧","⚙️","🔩","⚡","🔌","🧰","🪛","⚒️","🔨",
    // Backend & Database
    "🗄️","💿","📊","📈","📉","🗂️","🗃️","📁","📂","🗳️",
    // Security & Network
    "🔒","🔐","🔑","🛡️","🔓","🔏","🌐","🌍","🌎","🌏",
    // Code Quality & Testing
    "🐞","🐛","🪲","🧪","🧬","🔬","🔍","🔎","🧮","📐",
    // Architecture & Design
    "🧩","🎯","🎨","🏗️","🏛️","🧱","🪜","📦","📮","📫",
    // Documentation & Learning
    "📚","📖","📝","📄","📃","📋","📌","📍","🔖","🏷️",
    // Performance & Optimization
    "🚀","⚡","💨","🔥","💡","⏱️","⏰","⏲️","🧭","🎯",
    // API & Integration
    "🔗","⛓️","🔀","🔁","🔄","↔️","↕️","🔃","🔂","🎚️",
    // Monitoring & Analytics
    "📊","📈","📉","💹","📶","📡","🛰️","📟","📠","🖨️",
    // Cloud & DevOps
    "☁️","⛅","🌤️","🌥️","🌦️","🌧️","⛈️","🌩️","🌨️","🌪️",
    // Version Control
    "🔀","🔁","🔄","↩️","↪️","⤴️","⤵️","🔃","🔂","🔄",
    // Status & Alerts
    "✅","❌","⚠️","🚨","🔔","🔕","📢","📣","💬","💭",
    // Languages & Frameworks
    "☕","🐍","🦀","🐹","🐘","🐳","🐋","🦈","🐧","🍃"
  ];

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: CreateCategoryRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
        color,
        categoryType,
      };
      await categoryService.create(payload);
      toast.success("Tạo danh mục thành công!");
      setName("");
      setDescription("");
      setIcon(ICONS[0]);
      setColor(COLORS[0]);
      setCategoryType(CategoryType.BLOG);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Error creating category", err);
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi tạo danh mục";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tạo danh mục mới</h3>
          <button onClick={onClose} className="text-gray-500">Đóng</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên danh mục" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả (tuỳ chọn)" className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại danh mục</label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="categoryType"
                  checked={categoryType === CategoryType.BLOG}
                  onChange={() => setCategoryType(CategoryType.BLOG)}
                  className="w-4 h-4 text-accent focus:ring-accent"
                />
                <span className="ml-2 text-sm text-gray-700">Blog</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="categoryType"
                  checked={categoryType === CategoryType.POST}
                  onChange={() => setCategoryType(CategoryType.POST)}
                  className="w-4 h-4 text-accent focus:ring-accent"
                />
                <span className="ml-2 text-sm text-gray-700">Post</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
              <div className="mb-3">
                <input
                  value={emojiSearch}
                  onChange={(e) => setEmojiSearch(e.target.value)}
                  placeholder="Tìm emoji..."
                  className="w-full px-3 py-2 mb-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <div className="grid grid-cols-8 gap-3 max-h-44 overflow-y-auto p-2">
                  {EMOJI_LIST.filter(e => e.includes(emojiSearch)).map((e, i) => (
                    <button
                      key={`${e}-${i}`}
                      onClick={() => { setIcon(e); setEmojiSearch(""); }}
                      className={`p-2 text-2xl rounded-md flex items-center justify-center transition ${icon === e ? "bg-accent text-white shadow-md transform -translate-y-0.5" : "hover:bg-gray-100"}`}
                      aria-pressed={icon === e}
                      type="button"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)} type="button" className={`w-8 h-8 rounded-full ${color === c ? "ring-2 ring-offset-1 ring-accent" : "ring-1 ring-gray-200"}`} style={{ background: c }} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Hủy</button>
            <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-accent text-white rounded-lg">{isSubmitting ? "Đang tạo..." : "Tạo"}</button>
          </div>
        </div>
      </div>
  );
}
