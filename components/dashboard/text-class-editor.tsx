'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TextClass {
  className: string;
  color?: string;
  fontSize?: number;
  fontWeight?: string;
  backgroundColor?: string;
}

interface TextClassEditorProps {
  value: string;
  onChange: (value: string) => void;
  classes: TextClass[];
  onClassesChange: (classes: TextClass[]) => void;
  label?: string;
}

export function TextClassEditor({ 
  value, 
  onChange, 
  classes, 
  onClassesChange,
  label = 'Text'
}: TextClassEditorProps) {
  const [selectedText, setSelectedText] = useState<string>('');
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [showAddClassButton, setShowAddClassButton] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Parse HTML to extract text parts with classes
  const parseHTML = (html: string) => {
    const parts: Array<{ text: string; className?: string }> = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const div = doc.body.firstChild as HTMLElement;
    
    if (!div) return [{ text: html }];
    
    const walk = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        if (text.trim()) {
          parts.push({ text });
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement;
        if (element.tagName === 'SPAN' && element.className) {
          const className = element.className;
          const text = element.textContent || '';
          if (text.trim()) {
            parts.push({ text, className });
          }
        } else {
          // Recursively process child nodes
          Array.from(node.childNodes).forEach(walk);
        }
      }
    };
    
    Array.from(div.childNodes).forEach(walk);
    return parts.length > 0 ? parts : [{ text: html }];
  };

  const handleTextSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Get plain text version for selection
    const plainText = value.replace(/<[^>]*>/g, '');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = plainText.substring(start, end);

    if (selected.trim().length > 0) {
      setSelectedText(selected);
      setSelectionStart(start);
      setSelectionEnd(end);
      setShowAddClassButton(true);
    } else {
      setShowAddClassButton(false);
    }
  };

  const addClassToSelection = () => {
    if (!selectionStart || !selectionEnd || !newClassName.trim()) return;

    // Get the plain text version (strip HTML tags for selection)
    const plainText = value.replace(/<[^>]*>/g, '');
    const beforePlain = plainText.substring(0, selectionStart);
    const selectedPlain = plainText.substring(selectionStart, selectionEnd);
    const afterPlain = plainText.substring(selectionEnd);

    // Find the actual positions in HTML
    let htmlBefore = '';
    let htmlAfter = '';
    let currentPos = 0;
    let inTag = false;
    let tagBuffer = '';
    
    // Reconstruct HTML with new span
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      if (char === '<') {
        inTag = true;
        tagBuffer = '<';
      } else if (char === '>') {
        inTag = false;
        tagBuffer += '>';
        // Add tag to appropriate section
        if (currentPos <= selectionStart) {
          htmlBefore += tagBuffer;
        } else if (currentPos >= selectionEnd) {
          htmlAfter += tagBuffer;
        }
        tagBuffer = '';
      } else if (inTag) {
        tagBuffer += char;
      } else {
        // Regular text character
        if (currentPos < selectionStart) {
          htmlBefore += char;
        } else if (currentPos >= selectionEnd) {
          htmlAfter += char;
        }
        currentPos++;
      }
    }

    const newText = `${htmlBefore}<span class="${newClassName}">${selectedPlain}</span>${htmlAfter}`;
    onChange(newText);

    // Add class if it doesn't exist
    if (!classes.find(c => c.className === newClassName)) {
      const newClass: TextClass = {
        className: newClassName,
        color: '#3b82f6',
        fontSize: 16,
        fontWeight: 'normal',
      };
      onClassesChange([...classes, newClass]);
    }

    setNewClassName('');
    setShowAddClassButton(false);
    setSelectedText('');
    
    // Reset selection
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPos = selectionStart + `<span class="${newClassName}">`.length + selectedPlain.length + '</span>'.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        textareaRef.current.focus();
      }
    }, 0);
  };

  const updateClass = (className: string, updates: Partial<TextClass>) => {
    const newClasses = classes.map(c => 
      c.className === className ? { ...c, ...updates } : c
    );
    onClassesChange(newClasses);
  };

  const removeClass = (className: string) => {
    // Remove span tags with this class
    const regex = new RegExp(`<span class="${className}">(.*?)</span>`, 'gi');
    const newText = value.replace(regex, '$1');
    onChange(newText);
    
    // Remove class from list
    onClassesChange(classes.filter(c => c.className !== className));
  };


  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>{label}</Label>
          {/* Add Class Button - appears when text is selected */}
          {showAddClassButton && (
            <div className="flex items-center gap-2 rounded-lg border bg-background p-2 shadow-lg">
              <Input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Class name"
                className="h-8 w-32 text-xs"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newClassName.trim()) {
                    addClassToSelection();
                  } else if (e.key === 'Escape') {
                    setShowAddClassButton(false);
                  }
                }}
                autoFocus
              />
              <Button
                size="sm"
                onClick={addClassToSelection}
                disabled={!newClassName.trim()}
              >
                Add Class
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => setShowAddClassButton(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onSelect={handleTextSelection}
            onMouseUp={handleTextSelection}
            onKeyUp={handleTextSelection}
            className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
            placeholder="Select text and click 'Add Class' to style it. HTML format: &lt;span class=&quot;className&quot;&gt;text&lt;/span&gt;"
          />
        </div>
      </div>

      {/* Class Styling Controls */}
      {classes.length > 0 && (
        <div className="space-y-3 border-t border-border pt-4">
          <Label className="text-sm font-semibold">Class Styles</Label>
          {classes.map((cls) => (
            <div key={cls.className} className="rounded border border-border bg-background p-3 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold">.{cls.className}</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => removeClass(cls.className)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Color</Label>
                  <Input
                    type="color"
                    value={cls.color || '#000000'}
                    onChange={(e) => updateClass(cls.className, { color: e.target.value })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Font Size (px)</Label>
                  <Input
                    type="number"
                    value={cls.fontSize || 16}
                    onChange={(e) => updateClass(cls.className, { fontSize: Number(e.target.value) })}
                    className="h-8"
                  />
                </div>
                <div>
                  <Label className="text-xs">Font Weight</Label>
                  <select
                    value={cls.fontWeight || 'normal'}
                    onChange={(e) => updateClass(cls.className, { fontWeight: e.target.value })}
                    className="h-8 w-full rounded border border-input bg-background px-2 text-xs"
                  >
                    <option value="normal">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semi-bold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Background</Label>
                  <Input
                    type="color"
                    value={cls.backgroundColor || '#ffffff'}
                    onChange={(e) => updateClass(cls.className, { backgroundColor: e.target.value })}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
