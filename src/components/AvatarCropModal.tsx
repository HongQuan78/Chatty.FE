import React, { useEffect, useMemo, useRef, useState } from 'react';

type AvatarCropModalProps = {
  imageUrl: string;
  fileName: string;
  isSaving: boolean;
  onCancel: () => void;
  onCrop: (file: File) => void;
};

const CROP_SIZE = 300;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createCroppedAvatar = async (
  imageUrl: string,
  fileName: string,
  naturalSize: { width: number; height: number },
  offset: { x: number; y: number },
  zoom: number,
) => {
  const image = new Image();
  image.src = imageUrl;
  await image.decode();

  const fitScale = Math.max(CROP_SIZE / naturalSize.width, CROP_SIZE / naturalSize.height);
  const displayedWidth = naturalSize.width * fitScale * zoom;
  const displayedHeight = naturalSize.height * fitScale * zoom;
  const left = CROP_SIZE / 2 - displayedWidth / 2 + offset.x;
  const top = CROP_SIZE / 2 - displayedHeight / 2 + offset.y;

  const sourceX = ((0 - left) / displayedWidth) * naturalSize.width;
  const sourceY = ((0 - top) / displayedHeight) * naturalSize.height;
  const sourceWidth = (CROP_SIZE / displayedWidth) * naturalSize.width;
  const sourceHeight = (CROP_SIZE / displayedHeight) * naturalSize.height;

  const canvas = document.createElement('canvas');
  canvas.width = CROP_SIZE;
  canvas.height = CROP_SIZE;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Không thể xử lý ảnh crop.');
  }

  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, CROP_SIZE, CROP_SIZE);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result);
      else reject(new Error('Không thể tạo ảnh avatar.'));
    }, 'image/jpeg', 0.92);
  });

  const baseName = fileName.replace(/\.[^.]+$/, '') || 'avatar';
  return new File([blob], `${baseName}-cropped.jpg`, { type: 'image/jpeg' });
};

const AvatarCropModal: React.FC<AvatarCropModalProps> = ({ imageUrl, fileName, isSaving, onCancel, onCrop }) => {
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const dragStartRef = useRef<{ pointerId: number; x: number; y: number; offsetX: number; offsetY: number } | null>(null);

  const imageStyle = useMemo<React.CSSProperties>(() => {
    if (!naturalSize.width || !naturalSize.height) return {};

    const fitScale = Math.max(CROP_SIZE / naturalSize.width, CROP_SIZE / naturalSize.height);
    return {
      width: naturalSize.width * fitScale,
      height: naturalSize.height * fitScale,
      left: '50%',
      top: '50%',
      transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
      transformOrigin: 'center',
    };
  }, [naturalSize, offset, zoom]);

  const clampOffset = (nextOffset: { x: number; y: number }, nextZoom = zoom) => {
    if (!naturalSize.width || !naturalSize.height) return nextOffset;

    const fitScale = Math.max(CROP_SIZE / naturalSize.width, CROP_SIZE / naturalSize.height);
    const displayedWidth = naturalSize.width * fitScale * nextZoom;
    const displayedHeight = naturalSize.height * fitScale * nextZoom;
    const maxX = Math.max(0, (displayedWidth - CROP_SIZE) / 2);
    const maxY = Math.max(0, (displayedHeight - CROP_SIZE) / 2);

    return {
      x: clamp(nextOffset.x, -maxX, maxX),
      y: clamp(nextOffset.y, -maxY, maxY),
    };
  };

  useEffect(() => {
    setOffset((current) => clampOffset(current));
  }, [naturalSize.width, naturalSize.height, zoom]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart || dragStart.pointerId !== e.pointerId) return;

    setOffset(clampOffset({
      x: dragStart.offsetX + e.clientX - dragStart.x,
      y: dragStart.offsetY + e.clientY - dragStart.y,
    }));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartRef.current?.pointerId === e.pointerId) {
      dragStartRef.current = null;
    }
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextZoom = Number(e.target.value);
    setZoom(nextZoom);
    setOffset((current) => clampOffset(current, nextZoom));
  };

  const handleCrop = async () => {
    if (!naturalSize.width || !naturalSize.height || isSaving) return;
    const croppedFile = await createCroppedAvatar(imageUrl, fileName, naturalSize, offset, zoom);
    onCrop(croppedFile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[440px] overflow-hidden rounded-[30px] border border-[#ffd9e5] bg-white text-[#47313d] shadow-[0_24px_80px_rgba(72,35,52,0.24)] dark:border-[#5a3c4b] dark:bg-[#2c2430] dark:text-[#fff4f8]">
        <div className="flex items-center justify-between border-b border-[#ffd9e5] p-5 dark:border-[#5a3c4b]">
          <div>
            <h3 className="text-xl font-bold">Cắt avatar</h3>
            <p className="text-sm text-[#806f79] dark:text-[#d8bdca]">Kéo ảnh để căn mặt vào giữa khung.</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded-2xl p-2 text-[#d94676] transition hover:bg-[#fff0f3]" aria-label="Đóng crop avatar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div
            className="relative mx-auto h-[300px] w-[300px] touch-none overflow-hidden rounded-full bg-[#1f1720] shadow-inner"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <img
              src={imageUrl}
              alt="Ảnh cần crop"
              className="absolute max-w-none select-none"
              draggable={false}
              style={imageStyle}
              onLoad={(e) => {
                setNaturalSize({
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                });
              }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-full ring-4 ring-white/85"></div>
            <div className="pointer-events-none absolute inset-0 bg-black/10"></div>
          </div>

          <label className="block space-y-2">
            <span className="flex items-center justify-between text-sm font-bold">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={handleZoomChange}
              className="w-full accent-[#ff7fa3]"
            />
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-[#ffd9e5] p-5 dark:border-[#5a3c4b]">
          <button type="button" onClick={onCancel} disabled={isSaving} className="rounded-2xl px-4 py-2 text-sm font-bold text-[#806f79] transition hover:bg-[#fff0f3] disabled:opacity-60 dark:text-[#d8bdca]">
            Hủy
          </button>
          <button type="button" onClick={() => void handleCrop()} disabled={isSaving || !naturalSize.width} className="flex min-w-[130px] items-center justify-center gap-2 rounded-2xl bg-[#ff7fa3] px-5 py-2 text-sm font-bold text-white shadow-[0_12px_24px_rgba(255,127,163,0.28)] transition disabled:cursor-not-allowed disabled:opacity-70">
            <span className="material-symbols-outlined text-[18px]">{isSaving ? 'progress_activity' : 'check'}</span>
            {isSaving ? 'Đang lưu...' : 'Lưu avatar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarCropModal;
