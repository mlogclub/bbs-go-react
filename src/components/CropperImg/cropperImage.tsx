import { useEffect, useRef } from 'react';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './index.scss';

export interface CropperImageProps {
  src?: string;
  options?: Cropper.Options;
  onReady?: (instance: Cropper) => void;
}

export default function CropperImg(props: CropperImageProps) {
  const { src, onReady, options } = props;
  const domRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper>();
  useEffect(() => {
    if (!src) return;
    if (cropperRef.current) {
      cropperRef.current.destroy();
    }
    const defaultOption: Cropper.Options = {
      viewMode: 0,
      dragMode: 'move',
      initialAspectRatio: 1.5,
      aspectRatio: 1 / 1,
      preview: '.preview',
      background: true,
      autoCropArea: 0.6,
      zoomOnWheel: true,
      modal: true,
      minCropBoxWidth: 60,
    };
    if (domRef?.current) {
      cropperRef.current = new Cropper(domRef.current, Object.assign({}, defaultOption, options));
    }
    if (onReady && cropperRef?.current) {
      onReady(cropperRef.current);
    }
  }, [src]);

  return (
    <div className="cropper-img-wrap">
      <div className="cropper-img-box">
        <img src={src} alt="img" ref={domRef} />
      </div>
      <div className="cropper-preview-box">
        <div className="preview preview-lg"></div>
        <div className="preview preview-md"></div>
        <div className="preview preview-sm"></div>
      </div>
    </div>
  );
}
