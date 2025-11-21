'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewPageModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
}

export function NewPageModal({ open, onClose, onSubmit }: NewPageModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name: name.trim(), description: description.trim() });
      setName('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="!w-[80vw] !max-w-none p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Create New Page</DialogTitle>
          <DialogDescription className="text-base">
            Add a new page to your site. You can edit it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">
                Page Name *
              </Label>
              <Input
                autoFocus
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Home"
                required
                value={name}
                className="h-12"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Input
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Main landing page"
                value={description}
                className="h-12"
              />
            </div>
          </div>
          <DialogFooter className="gap-4 border-t pt-6">
            <Button
              onClick={onClose}
              type="button"
              variant="outline"
              size="lg"
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button disabled={!name.trim()} type="submit" size="lg" className="min-w-32">
              Create Page
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
