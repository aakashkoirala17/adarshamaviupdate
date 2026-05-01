import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

export const ListEditor = ({ label, items = [], onChange }: { label: string, items: string[], onChange: (newItems: string[]) => void }) => {
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (!newItem.trim()) return;
    onChange([...items, newItem.trim()]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2 border p-4 rounded-lg bg-background/50">
      <label className="text-sm font-bold block mb-2">{label}</label>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input value={item} onChange={(e) => {
              const newItems = [...items];
              newItems[index] = e.target.value;
              onChange(newItems);
            }} />
            <Button variant="destructive" size="sm" onClick={() => removeItem(index)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-2">
        <Input placeholder={`Add new ${label.toLowerCase()}`} value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addItem()} />
        <Button onClick={addItem} size="sm"><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
  );
};
