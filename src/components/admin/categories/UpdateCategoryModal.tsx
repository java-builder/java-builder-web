import { useEffect, useState } from "react";
import { CreateCategoryRequest, CategoryDetailResponse } from "@/types/category";
import { categoryService } from "@/services/category.service";

const ICONS = ["📘","📂","🏷️","🟧","🟩","🟦","📚","🧩"];
const COLORS = ["#0284C7","#0EA5A4","#10B981","#F97316","#F43F5E","#8B5CF6","#F59E0B","#374151"];
const EMOJI_LIST = [
  "💻","🖥️","🧑‍💻","🛠️","🧩","📦","📚","📝","🔧","⚙️","🧪","🧠","🐞","🐛","🔍",
  "🚀","⚡","🧵","🔒","🧰","🗂️","🧾","📁","🧭","📌","🧷","📎","🔗","📊","📈",
  "📉","🧮","🗃️","🗄️","🧿","🪲","🛡️","🔐"
];

export default function UpdateCategoryModal({ isOpen, onClose, category, onSuccess }: { isOpen: boolean; onClose: () => void; category?: CategoryDetailResponse | null; onSuccess?: () => void; }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>(ICONS[0]);
  const [emojiSearch, setEmojiSearch] = useState("");
  const [color, setColor] = useState<string>(COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setColor(category.color || COLORS[0]);
      setIcon(category.icon || ICONS[0]);
    }
  }, [category]);

  if (!isOpen || !category) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      const payload: Partial<CreateCategoryRequest> = {
        name: name.trim(),
        description: description.trim() || undefined,
        color,
        icon,
      };
      await categoryService.updateCategory(category.id, payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error updating category", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Cập nhật danh mục</h3>
          <button onClick={onClose} className="text-gray-500">Đóng</button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên danh mục" className="w-full px-3 py-2 border rounded-lg" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả (tuỳ chọn)" className="w-full px-3 py-2 border rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
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

            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)} type="button" className={`w-8 h-8 rounded-full ${color === c ? "ring-2 ring-offset-1 ring-accent" : "ring-1 ring-gray-200"}`} style={{ background: c }} />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="mt-4 flex justify-end space-x-3">
              <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg">Hủy</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="px-4 py-2 bg-accent text-white rounded-lg">{isSubmitting ? "Đang lưu..." : "Lưu"}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


