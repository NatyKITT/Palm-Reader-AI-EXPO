'use client';

export default function Header() {
  return (
      <div>
        <header role="banner" aria-label="hlavička">
          <div className="header grid_lt_wd">
            <div className="grid_sublvl">
              <nav className="grid_content" role="navigation" aria-label="Menu box">
                <div className="side side_l">
                  <div className="side_l_item item_logo">
                    <a className="logo" href="/">
                      <img className="logo_desktop" src="/img/logo/logo_white.svg" alt="praha 6 logo"/>
                      <img className="logo_mobile" src="/img/logo/logo_short_white.svg" alt="praha 6 logo"/>
                    </a>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </header>
      </div>
  );
}


