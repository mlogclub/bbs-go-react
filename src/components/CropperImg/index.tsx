import Cropper from 'cropperjs';
import { useEffect, useRef } from 'react';
import 'cropperjs/dist/cropper.css';
import './index.scss';

export interface CropperImageProps {
  src?: string;
  options?: Cropper.Options;
  onInit: () => void;
}

const CropperImage = (props: CropperImageProps) => {
  const { src, options } = props;
  const imgRef = useRef<HTMLImageElement>(null);
  const cropperRef = useRef<Cropper>();
  const defaultOptions: Cropper.Options = {
    aspectRatio: 1,
    preview: '.preview-img',
    dragMode: 'move',
  };

  const handleConfirm = () => {
    const img = cropperRef.current?.getCroppedCanvas().toBlob(data => {
      console.log(data);
    });
  };

  useEffect(() => {
    console.log(imgRef);
    if (imgRef.current) {
      cropperRef.current = new Cropper(imgRef.current, { ...defaultOptions, ...options });
    }
  }, []);

  return (
    <div className="cropper-wrap">
      <div className="cropper-img-box">
        <img src={src} ref={imgRef} alt="" className="cropper-img" />
      </div>
      <div className="preview-box">
        <div className="preview-img preview-l"></div>
        <div className="preview-img preview-m"></div>
        <div className="preview-img preview-s"></div>
      </div>

      <div>
        <button onClick={handleConfirm}>确定</button>
      </div>
    </div>
  );
};

export default CropperImage;
