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

interface NewSiteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    logo?: string;
  }) => void;
}

export function NewSiteModal({ open, onClose, onSubmit }: NewSiteModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        description: description.trim(),
        logo: logo.trim() || undefined,
      });
      setName('');
      setDescription('');
      setLogo('');
      onClose();
    }
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Site</DialogTitle>
          <DialogDescription>
            Create a new website or online shop. You can edit these details
            later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Site Name *</Label>
              <Input
                autoFocus
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="My Portfolio"
                required
                value={name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Personal portfolio website"
                value={description}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logo">Logo URL (Optional)</Label>
              <Input
                id="logo"
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                type="url"
                value={logo}
              />
              <p className="text-muted-foreground text-xs">
                You can upload a logo later
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose} type="button" variant="outline">
              Cancel
            </Button>
            <Button disabled={!name.trim()} type="submit">
              Create Site
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
