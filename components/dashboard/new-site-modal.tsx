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
import { ImageUpload } from './image-upload';

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
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && !isUploading) {
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

  const handleClose = () => {
    if (!isUploading) {
      onClose();
    }
  };

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent className="!w-[80vw] !max-w-none p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl">Create New Site</DialogTitle>
          <DialogDescription className="text-base">
            Create a new website or online shop. You can edit these details
            later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">
                Site Name *
              </Label>
              <Input
                autoFocus
                id="name"
                onChange={(e) => setName(e.target.value)}
                placeholder="My Portfolio"
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
                placeholder="Personal portfolio website"
                value={description}
                className="h-12"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-base">Logo (Optional)</Label>
              <ImageUpload
                value={logo}
                onChange={setLogo}
                onUploadStart={() => setIsUploading(true)}
                onUploadEnd={() => setIsUploading(false)}
                maxSizeMB={5}
              />
            </div>
          </div>
          <DialogFooter className="gap-4 border-t pt-6">
            <Button
              onClick={handleClose}
              type="button"
              variant="outline"
              disabled={isUploading}
              size="lg"
              className="min-w-24"
            >
              Cancel
            </Button>
            <Button
              disabled={!name.trim() || isUploading}
              type="submit"
              size="lg"
              className="min-w-32"
            >
              {isUploading ? 'Uploading...' : 'Create Site'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
