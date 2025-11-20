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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Add a new page to your site. You can edit it later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Page Name *</Label>
              <Input
                autoFocus
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="Home"
                required
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Main landing page"
                value={description}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={!name.trim()} type="submit">
              Create Page
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
