'use client';

import React, {useEffect} from 'react';
import Link from 'next/link';


const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth >= 768) return;

    const headings = document.querySelectorAll('.h_btn_rollout');

    const toggle = (e: Event) => {
      const target = (e.currentTarget as HTMLElement).dataset.rolloutTarget;
      if (!target) return;
      const footer = document.querySelector('footer');
      const openClass = `rollout_${target}_open`;

      if (footer?.classList.contains(openClass)) {
        footer.classList.remove(openClass);
      } else {
        footer?.classList.remove('rollout_01_open', 'rollout_02_open', 'rollout_03_open');
        footer?.classList.add(openClass);
      }
    };

    headings.forEach(el => el.addEventListener('click', toggle));
    return () => headings.forEach(el => el.removeEventListener('click', toggle));
  }, []);

  return (
      <div id="footer_cont" className="footer_cont">
        <div className="spacer spacer_0"></div>
        <footer className="footer_cont--grid" role="contentinfo" aria-label="patička">
          <div className="footer_main grid_lt_wd">
            <div className="grid_sublvl">
              <nav className="grid_content" role="navigation" aria-label="Druhotné menu">
                <div className="grid_sublvl03 row">
                  <div className="col col01 col-6 col-md-4 col-sm-12 row">
                    <div className="col col01 col-6 col-md-12">
                      <h2 className="h h_btn_rollout" data-rollout-target="01">
                        Městská část Praha&nbsp;6
                        <button className="btn btn_rollout db-sm-true d-false" data-rollout-target="01"
                                aria-label="Otevřít menu patičky 01">
                          <span className="sign plus"><img className="icon"
                                                           src="/img/icons/plus-primary-800_GmatSymbols.svg"
                                                           alt="plus"/></span>
                          <span className="sign minus"><img className="icon"
                                                            src="/img/icons/minus-primary-800_GmatSymbols.svg"
                                                            alt="minus"/></span>
                        </button>
                      </h2>
                      <div className="rollout rollout_01">
                        <Link href="https://www.praha6.cz/uvodni_stranka.html" target="_blank">Úvodní stránka</Link>
                        <Link href="https://www.praha6.cz/zpravodajstvi.html" target="_blank">Zpravodajství</Link>
                        <Link href="https://www.praha6.cz/akce.html" target="_blank">Akce</Link>
                        <Link href="https://www.praha6.cz/dopravni_omezeni.html" target="_blank">Dopravní omezení</Link>
                        <Link href="https://www.praha6.cz/rozvoj.html" target="_blank">Rozvoj a územní plán</Link>
                        <Link href="https://www.praha6.cz/sestka.html" target="_blank">Šestka, noviny MČ Praha 6</Link>
                      </div>
                    </div>
                    <div className="col col02 col-6 col-md-12">
                      <div className="rollout rollout_01">
                        <div className="spacer spacer_40"></div>
                        <Link href="https://www.praha6.cz/potrebuji_vyresit.html" target="_blank">Potřebuji
                          vyřešit</Link>
                        <Link href="https://www.praha6.cz/nahlasit_problem.html" target="_blank">Nahlásit problém</Link>
                        <Link href="https://www.praha6.cz/kontakty.html" target="_blank">Kontakty</Link>
                        <Link href="https://www.praha6.cz/odbory.html" target="_blank">Odbory</Link>
                        <Link href="https://www.praha6.cz/uredni_deska.html" target="_blank">Úřední deska</Link>
                        <Link href="https://www.praha6.cz/zapisy_usneseni.html" target="_blank">Zápisy a usnesení</Link>
                        <Link href="https://www.praha6.cz/samosprava.html" target="_blank">Samospráva</Link>
                        <Link href="https://www.praha6.cz/finance.html" target="_blank">Finance</Link>
                        <Link href="https://www.praha6.cz/dotace.html" target="_blank">Dotace</Link>
                        <Link href="https://www.praha6.cz/pro_media.html" target="_blank">Pro média</Link>
                        <Link href="https://www.praha6.cz/smlouvy_a_verejne_zakazky.html" target="_blank">Smlouvy a
                          veřejné zakázky</Link>
                        <Link href="https://www.praha6.cz/otevrena_data.html" target="_blank">Otevřená data</Link>
                        <Link href="https://www.praha6.cz/volna_pracovni_mista.html" target="_blank">Volná pracovní
                          místa</Link>
                        <Link href="https://www.praha6.cz/newsletter_odhlaseni.html" target="_blank">Odhlásit z odběru
                          novinek</Link>
                      </div>
                    </div>
                  </div>
                  <div className="col col02 col-6 col-md-8 col-sm-12 row">
                    <div className="col col01 col-6 col-sm-12">
                      <h2 className="h h_btn_rollout" data-rollout-target="02">Kontakt a úřední hodiny
                        <button className="btn btn_rollout db-sm-true d-false" data-rollout-target="02"
                                aria-label="Otevřít menu patičky 02">
                          <span className="sign plus"><img className="icon"
                                                           src="/img/icons/plus-primary-800_GmatSymbols.svg"
                                                           alt="plus"/></span>
                          <span className="sign minus"><img className="icon"
                                                            src="/img/icons/minus-primary-800_GmatSymbols.svg"
                                                            alt="minus"/></span>
                        </button>
                      </h2>
                      <div className="rollout rollout_02">
                        <address>
                          <p>Úřad městské části Praha&nbsp;6 <a href="https://goo.gl/maps/9HmAv2BiXrBqfuZY8"
                                                                target="_blank">Československé armády 23</a> 160 52
                            Praha&nbsp;6</p>
                          <p>infolinka: <span><a className="a_tel" href="tel:800-800-001"
                                                 target="_blank">800 800 001</a></span></p>
                          <p className="txt_icon ti_size-5 right">
                            <a href="https://www.praha6.cz/kontakty/online-prepis-reci_62578.html" target="_blank"><b>Infolinka
                              s přepisem</b></a>
                            <span className="txt_img_cont">
                              <img className="icon" src="/img/icons/icon_neslysici-primary-600.svg"
                                   alt="neslysici"/>
                            </span>
                          </p>
                          <p>ústředna: <span><a className="a_tel" href="tel:220-189-111" target="_blank">220 189 111</a></span>
                          </p>
                          <p>e-mail: <span><a className="a_mail" href="mailto:podatelna@praha6.cz"
                                              target="_blank">podatelna@praha6.cz</a></span></p>
                          <p>datová schránka: <span>bmzbv7c</span></p>
                        </address>
                        <h3 className="h">Podatelna a dvorana</h3>
                        <div className="open_hours">
                          <p><span>pondělí</span><span>08:00 - 18:00</span></p>
                          <p><span>úterý</span><span>08:00 - 16:00</span></p>
                          <p><span>středa</span><span>08:00 - 18:00</span></p>
                          <p><span>čtvrtek</span><span>08:00 - 16:00</span></p>
                          <p><span>pátek</span><span>08:00 - 14:00</span></p>
                        </div>
                        <a href="https://www.praha6.cz/kontakty/kontakty-rozcestnik.html" target="_blank">Všechny
                          kontakty</a>
                      </div>
                    </div>
                    <div className="col col02 col-6 col-sm-12">
                      <div className="social_desktop d-sm-false">
                        <h2 className="h">Sociální sítě</h2>
                        <div className="socmedia_cont">
                          <a className="icon" href="https://praha6.cz/fb" target="_blank">
                            <img className="icon" src="/img/icons/facebook-primary-600.svg"
                                 alt="link facebook"/>
                          </a>
                          <a className="icon" href="https://praha6.cz/x" target="_blank">
                            <img className="icon" src="/img/icons/twitter-primary-600.svg"
                                 alt="link twitter x"/>
                          </a>
                          <a className="icon" href="https://praha6.cz/yt" target="_blank">
                            <img className="icon" src="/img/icons/youtube-primary-600.svg" alt="link youtube"/>
                          </a>
                          <a className="icon" href="https://praha6.cz/ig" target="_blank">
                            <img className="icon" src="/img/icons/instagram-primary-600.svg"
                                 alt="link instagram"/>
                          </a>
                          <a className="icon" href="https://praha6.cz/in" target="_blank">
                            <img className="icon" src="/img/icons/linkedin-primary-600.svg"
                                 alt="link linkedin"/>
                          </a>
                        </div>
                      </div>
                      <h2 className="h h_btn_rollout" data-rollout-target="03">Další stránky
                        <button className="btn btn_rollout db-sm-true d-false" data-rollout-target="03"
                                aria-label="Otevřít menu  03">
                          <span className="sign plus"><img className="icon"
                                                           src="/img/icons/plus-primary-800_GmatSymbols.svg"
                                                           alt="plus"/></span>
                          <span className="sign minus"><img className="icon"
                                                            src="/img/icons/minus-primary-800_GmatSymbols.svg"
                                                            alt="minus"/></span>
                        </button>
                      </h2>
                      <div className="rollout rollout_03">
                        <a href="https://system.praha6.cz/" target="_blank">Přihlášení do systému</a>
                        <a href="https://gis.pha6.cz/" target="_blank">Geoportál Praha 6</a>
                        <a href="http://www.sestka.cz/" target="_blank">Šestka</a>
                        <a href="https://lepsi6.cz/" target="_blank">Lepší 6</a>
                        <a href="https://www.jakdoskolky.cz/" target="_blank">Jak do školky</a>
                        <a href="https://www.senior6.cz/" target="_blank">Senior 6</a>
                        <a href="https://www.napadprosestku.cz/" target="_blank">Nápad pro Šestku</a>
                        <a href="https://aktivnimesto.cz/" target="_blank">Aktivní město</a>
                        <a href="https://www.ladronkafest.cz/" target="_blank">Ladronkafest</a>
                        <a href="http://carodejnicenaladronce.cz/" target="_blank">Čarodějnice na Ladronce</a>
                        <a href="https://www.facebook.com/LetniKinoUKeplera" target="_blank">Letní kino u Keplera</a>
                      </div>
                      <div className="social_mobile db-sm-true d-false">
                        <h2 className="h">Sociální sítě</h2>
                        <div className="socmedia_cont">
                          <a className="icon" href="https://www.facebook.com/praha6" target="_blank">
                            <img className="icon" src="/img/icons/facebook-primary-600.svg"
                                 alt="link facebook"/>
                          </a>
                          <a className="icon" href="https://twitter.com/Praha6" target="_blank">
                            <img className="icon" src="/img/icons/twitter-primary-600.svg" alt="link twitter"/>
                          </a>
                          <a className="icon" href="https://www.youtube.com/channel/UCJaEDb88jYOPTJYu6QYnSfQ"
                             target="_blank">
                            <img className="icon" src="/img/icons/youtube-primary-600.svg" alt="link youtube"/>
                          </a>
                          <a className="icon" href="https://www.instagram.com/mestskacastpraha6/" target="_blank">
                            <img className="icon" src="/img/icons/instagram-primary-600.svg"
                                 alt="link instagram"/>
                          </a>
                          <a className="icon" href="https://praha6.cz/in" target="_blank">
                            <img className="icon" src="/img/icons/linkedin-primary-600.svg" alt="link linkedin"/>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>

          <div className="copyright grid_lt_wd">
            <div className="grid_sublvl">
              <div className="grid_content">
                <div className="side side_l">
                  <p>{currentYear} ÚMČ Praha&nbsp;6</p>
                </div>
                <div className="side side_r">
                  <a href="https://www.praha6.cz/nezarazeno/webmaster-a-prohlaseni-o-pristupnosti_54.html"
                     target="_blank">Prohlášení o přístupnosti</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
  );
};

export default Footer;