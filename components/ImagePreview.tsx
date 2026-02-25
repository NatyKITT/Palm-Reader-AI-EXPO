import React from 'react';
import {Card, CardContent} from "@/components/ui/card";
import AspectRatio from "@/components/ui/aspect-ratio";

interface ImagePreviewProps {
  imageUrl: string | null;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({imageUrl}) => {
  return (
      <Card className="img_preview_card">
        <CardContent className="img_preview_content">
          <AspectRatio ratio={4 / 3}>
            {imageUrl ? (
                <img src={imageUrl} alt="Nahraná fotografie dlaně" className="img_preview_image"/>
            ) : (
                <div className="img_preview_empty">
                  <p>Nahrajte nebo vyfoťte fotografii své levé dlaně</p>
                </div>
            )}
          </AspectRatio>
        </CardContent>
      </Card>
  );
};

export default ImagePreview;