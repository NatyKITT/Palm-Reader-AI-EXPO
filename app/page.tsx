'use client';

import React, {useEffect, useRef, useState} from 'react';
import {motion} from 'framer-motion';
import axios from 'axios';
import {Loader} from 'lucide-react';
import HowToUse from '@/components/HowToUse';
import FileUpload from '@/components/FileUpload';
import ImagePreview from '@/components/ImagePreview';
import PalmReading from '@/components/PalmReading';
import {Button} from "@/components/ui/button";

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
  const [imageData, setImageData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [analyzed, setAnalyzed] = useState(false);
  const [formKey, setFormKey] = useState(0); // reset formuláře

  const nameRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);

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
    setIsErrorReading(false);
    setAnalyzed(false);
  };

  const handleReset = () => {
    setUserName('');
    setBirthDate('');
    setGender('');
    setReading(null);
    setIsErrorReading(false);
    setImageData(null);
    setAnalyzed(false);
    setFormKey(prev => prev + 1);
  };

  const handleAnalyze = async () => {
    if (!imageData) return;
    setIsLoading(true);
    setReading(null);
    setIsErrorReading(false);
    setAnalyzed(false);

    try {
      const response = await axios.post<{reading: string; isError: boolean}>('/api/analyze', {
        imageData,
        userName: userName.trim() || undefined,
        birthDate: birthDate || undefined,
        gender: gender || undefined,
      });
      setReading(response.data.reading);
      setIsErrorReading(response.data.isError);
    } catch {
      setReading("⚠️ Došlo k chybě při generování věštby. Zkuste to prosím znovu.");
      setIsErrorReading(true);
    } finally {
      setIsLoading(false);
      setAnalyzed(true);
    }
  };

  return (
      <div className="section">
        <div id="how-to-use"><HowToUse/></div>
        <div className="spacer spacer_40"></div>

        <div className="grid_content">
          {/* formKey způsobí remount = reset všech inputů na prázdné */}
          <div key={formKey} className="input_box">
            <div>
              <label htmlFor="name">Jméno (nepovinné)</label>
              <input
                  ref={nameRef}
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Jméno"
                  className="datepicker ui-datepicker"
                  onChange={e => setUserName(e.target.value)}
                  autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="birthdate">Datum narození (nepovinné)</label>
              <input
                  ref={dateRef}
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  className="datepicker ui-datepicker"
                  onChange={e => setBirthDate(e.target.value)}
                  autoComplete="bday"
              />
            </div>
            <div>
              <label htmlFor="gender">Pohlaví (nepovinné)</label>
              <select
                  ref={genderRef}
                  id="gender"
                  name="gender"
                  className="input--select"
                  onChange={e => setGender(e.target.value)}
              >
                <option value="">Nechci uvádět</option>
                <option value="žena">Žena</option>
                <option value="muž">Muž</option>
              </select>
            </div>
          </div>

          <div id="palm-reading">
            <div className="p6_card">
              <div className="p6_card_inner">
                <ImagePreview imageUrl={imageData}/>

                <FileUpload
                    key={formKey}
                    onUploadComplete={handleUploadComplete}
                />

                {imageData && !isLoading && !analyzed && (
                    <Button
                        className="btn_fill btn_fill--get-reading btn-width"
                        onClick={handleAnalyze}
                    >
                      Získat věštbu
                    </Button>
                )}

                {imageData && !isLoading && analyzed && (
                    <Button
                        className="btn_fill btn_fill--get-reading btn-width"
                        onClick={handleReset}
                    >
                      Získat novou věštbu
                    </Button>
                )}

                {isLoading && (
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

                {reading !== null && (
                    <PalmReading
                        reading={reading}
                        birthdate={birthDate || undefined}
                        userName={userName.trim() || undefined}
                        isError={isErrorReading}
                    />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
