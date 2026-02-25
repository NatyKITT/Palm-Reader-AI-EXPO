'use client';

import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {motion} from 'framer-motion';
import axios from 'axios';
import {Loader} from 'lucide-react';
import HowToUse from '@/components/HowToUse';
import FileUpload from '@/components/FileUpload';
import ImagePreview from '@/components/ImagePreview';
import PalmReading from '@/components/PalmReading';
import PastReadingsGallery from '@/components/PastReadingsGallery';
import {Button} from "@/components/ui/button";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {sha256} from "js-sha256";

const loadingMessages = [
  "🔮 Věštkyně sleduje čáry osudu...",
  "✨ Čte linii života a lásky...",
  "🔍 Odhaluje skryté talenty a výzvy...",
  "🌟 Předvídá radostné události budoucnosti...",
  "🪄 Věští štěstí, lásku a úspěch...",
];

export default function Home() {
  const [userName, setUserName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [reading, setReading] = useState<string | null>(null);
  const [isErrorReading, setIsErrorReading] = useState(false);
  // imageData je nyní base64 string (nebo null)
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  const router = useRouter();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[index]);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleUploadComplete = (base64: string) => {
    setImageData(base64);
    setReading(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageData) return;

    setIsLoading(true);
    setError(null);
    setIsErrorReading(false);
    setReading(null);

    try {
      // Hash z base64 dat (konzistentní pro stejný obrázek)
      const imageHash = sha256(imageData);

      const response = await axios.post<{
        reading: string;
        id?: string;
        isError: boolean;
      }>('/api/analyze', {
        imageData,
        userName,
        birthDate,
        gender,
        hash: imageHash,
      });

      const {reading: newReading, id, isError} = response.data;
      setReading(newReading);
      setIsErrorReading(isError);

      if (!isError && id) {
        router.push(`/reading/${id}`);
      }
    } catch (err) {
      console.error('Chyba při analýze:', err);
      setError('⚠️ Došlo k chybě při generování věštby.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section">
      <div id="how-to-use">
        <HowToUse/>
      </div>
      <div className="spacer spacer_40"></div>

      <div className="grid_content">
        <div className="input_box">
          <div>
            <label htmlFor="name">Jméno (nepovinné)</label>
            <input type="text" id="name" name="name" placeholder="Jméno"
              className="datepicker ui-datepicker"
              onChange={e => setUserName(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label htmlFor="birthdate">Datum narození (nepovinné)</label>
            <input type="date" id="birthdate" name="birthdate"
              className="datepicker ui-datepicker"
              onChange={e => setBirthDate(e.target.value)} autoComplete="bday" />
          </div>
          <div>
            <label htmlFor="gender">Pohlaví (nepovinné)</label>
            <select id="gender" name="gender" className="input--select"
              onChange={e => setGender(e.target.value)}>
              <option value="">Nechci uvádět</option>
              <option value="žena">Žena</option>
              <option value="muž">Muž</option>
            </select>
          </div>
        </div>

        <Tabs defaultValue="current" id="palm-reading">
          <TabsList className="tabs_nav">
            <TabsTrigger value="current">Aktuální věštba</TabsTrigger>
            <TabsTrigger value="past">Minulé věštby</TabsTrigger>
          </TabsList>

          <TabsContent value="current">
            <div className="p6_card">
              <div className="p6_card_inner">
                {/* ImagePreview dostane base64, zobrazí se přímo bez Firebase */}
                <ImagePreview imageUrl={imageData}/>
                <FileUpload onUploadComplete={handleUploadComplete}/>
                {imageData && !isLoading && (
                  <Button className="btn_fill btn_fill btn_fill--get-reading btn-width" onClick={handleAnalyze}>
                    {reading ? 'Získat novou věštbu' : 'Získat věštbu'}
                  </Button>
                )}
                {isLoading && !reading && (
                  <div className="loading_box">
                    <Loader className="loading_spinner animate-spin" size={40}/>
                    <motion.p
                      key={loadingMessage}
                      initial={{opacity: 0, y: 20}}
                      animate={{opacity: 1, y: 0}}
                      transition={{duration: 0.5}}
                      className="loading_text"
                    >
                      {loadingMessage}
                    </motion.p>
                    <p className="loading_caption">Načítám vaši věštbu...</p>
                  </div>
                )}
                {error && <div className="error_box">{error}</div>}
                {reading && (
                  <PalmReading
                    reading={reading}
                    birthdate={birthDate ? birthDate : undefined}
                    isError={isErrorReading}
                  />
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="past">
            <PastReadingsGallery/>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
