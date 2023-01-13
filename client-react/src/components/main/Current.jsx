export default function Current() {
  console.log('Current rendered!');

  return (
    <div>
      <div className="current-top-left">
        <div
          className="current-location"
          data-current-id
          data-current-location
        />
        <img
          className="weather-icon large"
          src="http://openweathermap.org/img/wn/10d@4x.png"
          width="200"
          height="200"
          alt="rain"
          data-current-icon
        />
      </div>
      <div className="current-top-right">
        <div className="current-detail">
          lat:&nbsp;
          <span data-current-lat />
        </div>
        <div className="current-detail">
          long:&nbsp;
          <span data-current-long />
        </div>
        <div className="current-top-right-block">
          <div className="current-high-low">
            <span data-current-high />/
            <span className="degrees" data-current-low />
          </div>
          <div className="current-temp" data-temp-units=" F">
            <span className="degrees" data-current-temp />
          </div>
          <div className="current-feels-like">
            <span data-dictionary="6">Feels Like</span>
            <span>:&nbsp;</span>
            <span className="degrees value" data-current-fl />
          </div>
          <div className="current-description" data-current-description />
          <div className="label">
            <span data-dictionary="7">Precip</span>
            <span>:&nbsp;</span>
            <span className="value percent" data-current-precip />
          </div>
          <div className="label">
            <span data-dictionary="8">Visibility</span>
            <span>:&nbsp;</span>
            <span
              className="value"
              data-current-visibility
              data-visibility-units=" mi"
            />
          </div>
        </div>
      </div>
      <div className="current-bottom-left">
        <div className="label">
          <span data-dictionary="9">UV Index</span>
          <span>:&nbsp;</span>
          <span className="value" data-current-uv-index />
          <span>&nbsp;</span>
          <span className="value" data-current-uv-level />
        </div>
        <div className="label">
          <span data-dictionary="10">Humidity</span>
          <span>:&nbsp;</span>
          <span className="value percent" data-current-humidity />
        </div>
        <div className="label">
          <span data-dictionary="11">Wind</span>
          <span>:&nbsp;</span>
          <span
            className="value"
            data-current-wind-speed
            data-wind-units=" mi/h "
          />
          <span className="value" data-current-wind-direction />
        </div>
      </div>
      <div className="current-bottom-right">
        <div className="label">
          <span data-dictionary="12">Dew Point</span>
          <span>:&nbsp;</span>
          <span className="value degrees" data-current-dew-point />
        </div>
        <div className="label">
          <span data-dictionary="13">Sunrise</span>
          <span>:&nbsp;</span>
          <span className="value" data-current-sunrise />
        </div>
        <div className="label">
          <span data-dictionary="14">Sunset</span>
          <span>:&nbsp;</span>
          <span className="value" data-current-sunset />
        </div>
      </div>
    </div>
  );
}
