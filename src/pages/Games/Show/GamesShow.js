import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react";


import ReactPlayer from "react-player";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/themes/splide-default.min.css';

import '@fortawesome/fontawesome-free/css/all.min.css';

import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import Navbar from "../../../components/Navbar/Navbar";
import Api from "../../../services/Api";

import './GamesShow.scss'



class GamesShow extends React.Component {
  constructor(props) {
    super(props);


    this.state = { game: {}}
  }

  componentDidMount() {
    const slug = this.props.match.params.slug;
    const path = `/listings/${slug}`;

    Api.get(path).then((response) => {
      this.setState({
        game: response.data.data.attributes
      });
    })
  }

  splideSlides() {
    let slides = [];

    if (!this.state.game.id) return [];

    let key = 1;

    this.state.game.videos.forEach((video, i) => {
      slides.push(
        <SplideSlide key={key}>
          <ReactPlayer
            url={video}
            thumbnail={this.state.game.images[0]}
            playing={false}
            controls
            width="640px"
            height="640px"
            muted
            />
        </SplideSlide>
      )

      key += 1;
    });

    this.state.game.images.forEach((image) => {
      const imageAlt = `${this.state.game.title} cover`;

      slides.push(
        <SplideSlide key={key}>
          <img src={image} alt={imageAlt} />
        </SplideSlide>
      )

      key += 1;
    });

    return slides;
  }

  render() {
    const coverAlt = `${this.state.game.title} cover`

    return (
      <div className="App listings-show">
        <Navbar />
        <div className="container">
          <div className="row">
            <div className="splide-container">
              <Splide className="splide-slider" hasSliderWrapper={true}
                options= {{
                  type:"loop",
                  easing:"ease",
                  keyboard: true,
                  autoHeight: true,
                  autoWidth: true
                }}>
                {this.splideSlides()}
              </Splide>
            </div>

            <div className="game-info">
              { this.state.game.images && (
                <img src={this.state.game.images[0]} alt={coverAlt} />
              )}
              <p>{this.state.game.description}</p>
            </div>
          </div>



        </div>
        <div className="info-section">
          <div className="pricing">
            <form>
              <div className="payment">
                  <div className="crypto">
                    <div className="bitcoin">
                      <label class="topcoat-radio-button">
                        <input type="radio" id="btc" name="payment_method" />
                        <div class="topcoat-radio-button__checkmark"></div>
                      </label>
                      <Tippy
                        content={`${this.state.game.btc_amount} BTC`}
                        interactive={true}
                        interactiveBorder={20}
                        delay={100}
                        arrow={true}
                        placement="auto"
                        >
                        <i class="fab fa-bitcoin"></i>

                      </Tippy>

                    </div>
                    <div className="monero">
                      <label class="topcoat-radio-button">
                        <input type="radio" id="xmr" name="payment_method" />
                        <div class="topcoat-radio-button__checkmark"></div>
                      </label>
                      <Tippy
                        content={`${this.state.game.xmr_amount} XMR`}
                        interactive={true}
                        interactiveBorder={20}
                        delay={100}
                        arrow={true}
                        placement="auto"
                        >
                        <i class="fab fa-monero"></i>
                      </Tippy>

                    </div>
                  </div>

                  <div className="fiat">
                    <h3>
                      {this.state.game.currency_symbol}
                      {this.state.game.price / 100} {this.state.game.default_currency}
                    </h3>
                  </div>
                  <div className="payment-submit">
                    <button class="topcoat-button--large--cta" disabled type="submit" >
                      Buy
                    </button>
                  </div>
              </div>

              <div class="vl"></div>

              <div className="platforms"></div>
            </form>

          </div>

          <p className="description">
            {this.state.game.description}
          </p>
        </div>


      </div>
    )
  }
};

export default observer(GamesShow);