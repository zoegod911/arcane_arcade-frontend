import React, { useEffect } from 'react';
import { observer } from 'mobx-react';

import ReactPlayer from 'react-player';
import { Splide, SplideSlide } from '@splidejs/react-splide';

import '@splidejs/splide/dist/css/themes/splide-default.min.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'trix/dist/trix.css';

import { useStore } from '../../../store';

import Navbar from '../../../components/Navbar/Navbar';
import Loading from '../../../components/Loading/Loading';

import Api from '../../../services/Api';

import './GamesShow.scss';

const Images = ({ images, gameTitle }) => images.map((image) => (
  <SplideSlide key={image}>
    <img src={image} alt={`${gameTitle} cover`} />
  </SplideSlide>
));

const Videos = ({ videos, thumbnail }) => videos.map((video) => (
  <SplideSlide key={video}>
    <ReactPlayer
      url={video}
      thumbnail={thumbnail}
      playing={false}
      controls
      muted
    />
  </SplideSlide>
));

const Splides = ({ images, videos, gameTitle }) => (
  <>
    <Videos
      videos={videos}
      thumbnail={images.length > 0 ? images[0] : null}
    />
    <Images images={images} gameTitle={gameTitle} />
  </>
);

const GamesShow = ({ match, history }) => {
  const {
    games: { loadGame, selectedGame },
    auth: { isLoggedIn },
  } = useStore();

  const { slug } = match.params;

  useEffect(() => {
    loadGame(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (!selectedGame) return <Loading />;

  const onFormSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      history.push('/login');
      return;
    }

    const coin_type = document.querySelector(
      'input[name="payment_method"]:checked',
    ).id;
    // eslint-disable-next-line
    const deposit_amount = this.state.game[`${coin_type}_amount`];

    const response = await Api.post('/orders', {
      coin_type: coin_type.toUpperCase(),
      coin_amount: deposit_amount,
      // eslint-disable-next-line
      listing_id: this.state.game.id,
      // eslint-disable-next-line
      fiat_currency: this.state.game.default_currency,
    });

    if (response.status === 200) {
      // eslint-disable-next-line
      this.props.history.push(`/buy/${response.data.id}`);
    }
  };

  return (
    <div className="App listings-show">
      <Navbar />

      <div className="splide-container">
        <Splide
          className="splide-slider"
          options={{
            type: 'loop',
            easing: 'ease',
            keyboard: true,
            perPage: 1,
          }}
        >
          <Splides
            images={selectedGame.images}
            videos={selectedGame.videos}
            gameTitle={selectedGame.title}
          />
        </Splide>
      </div>

      <div className="info-section">
        <div className="pricing">
          <form>
            <div className="payment">
              <div className="crypto">
                {selectedGame.accepts_bitcoin && (
                  <div className="bitcoin">
                    <label className="topcoat-radio-button">
                      <input type="radio" id="btc" name="payment_method" />
                      <div className="topcoat-radio-button__checkmark" />
                      <Tippy
                        content={`${selectedGame.btc_amount} BTC`}
                        interactive
                        interactiveBorder={20}
                        delay={100}
                        arrow
                        placement="auto"
                      >
                        <i className="fab fa-bitcoin" />
                      </Tippy>
                    </label>
                  </div>
                )}
                {selectedGame.accepts_monero && (
                  <div className="monero">
                    <label className="topcoat-radio-button">
                      <input type="radio" id="xmr" name="payment_method" />
                      <div className="topcoat-radio-button__checkmark" />
                      <Tippy
                        content={`${selectedGame.xmr_amount} XMR`}
                        interactive
                        interactiveBorder={20}
                        delay={100}
                        arrow
                        placement="auto"
                      >
                        <i className="fab fa-monero" />
                      </Tippy>
                    </label>
                  </div>
                )}
              </div>

              <div className="fiat">
                {selectedGame.price && (
                  <h3>
                    {selectedGame.currency_symbol}
                    {selectedGame.price}
                    {' '}
                    {selectedGame.default_currency}
                  </h3>
                )}
              </div>
            </div>

            <div className="vl" />

            <div className="platforms">
              {selectedGame.hasSupportedPlatform('WINDOWS') && (
                <div className="windows">
                  <i className="fab fa-windows" />
                  <h3>Windows</h3>
                </div>
              )}

              {selectedGame.hasSupportedPlatform('MAC') && (
                <div className="mac">
                  <i className="fab fa-apple" />
                  <h3>Mac</h3>
                </div>
              )}

              {selectedGame.hasSupportedPlatform('LINUX') && (
                <div className="linux">
                  <i className="fab fa-linux" />
                  <h3>Linux</h3>
                </div>
              )}
            </div>
            <div className="payment-submit">
              <button
                onClick={onFormSubmit}
                className="topcoat-button--large--cta"
                type="submit"
              >
                Buy
              </button>
            </div>
          </form>
        </div>
        <div
          className="description"
          // eslint-disable-next-line
          dangerouslySetInnerHTML={{ __html: selectedGame.description }}
        />
      </div>
    </div>
  );
};

export default observer(GamesShow);