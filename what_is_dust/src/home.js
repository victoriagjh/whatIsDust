import React, { Component } from "react";
// import { Link } from "react-router-dom";

import "./home.css";

import { Map, Marker, MarkerClusterer, Polyline } from "react-kakao-maps";
import API from "./API";
import "bootstrap/dist/css/bootstrap.min.css";

import veryGood from "./gradeIcon/cool.png";
import good from "./gradeIcon/smile.png";
import bad from "./gradeIcon/angry.png";
import veryBad from "./gradeIcon/devil.png";
import next from "./gradeIcon/next.png";
import start from "./gradeIcon/start.png";
import finish from "./gradeIcon/finish.png";
import loading from "./gradeIcon/loading.gif";
import Button from "react-bootstrap/Button";
import Axios from "axios";

/* global kakao */

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map: null,
      markers: [],
      curMarker: new kakao.maps.Marker({
        position: new kakao.maps.LatLng(37.503716, 127.044844),
      }),
      placeSearch: new kakao.maps.services.Places(),
      infoWindow: new kakao.maps.CustomOverlay({}),
      region: "은평구청",
      departure: null,
      departureTitle: null,
      arrival: null,
      arrivalTitle: null,
      curAirCondition: null,
      routeInformation: null,
      buttonClicked: null,
      curAirCondition: null,
      routeInformation: null,
      temperature: null,
      humidity: null,
      weather: null,
      icon: null,
      wind: null,
      cloud: null,
    };

    this.searchPlaces = this.searchPlaces.bind(this);
    this.placesSearchCB = this.placesSearchCB.bind(this);
    this.displayPlaces = this.displayPlaces.bind(this);
    this.removeAllChildNods = this.removeAllChildNods.bind(this);
    this.removeMarker = this.removeMarker.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.getListItem = this.getListItem.bind(this);
    this.displayInfowindow = this.displayInfowindow.bind(this);
    this.displayPagination = this.displayPagination.bind(this);
    this.closeOverlay = this.closeOverlay.bind(this);
    this.getRouteAirCondition = this.getRouteAirCondition.bind(this);
  }

  searchPlaces() {
    var keyword = document.getElementById("keyword").value;

    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요!");
      return false;
    }
    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    this.state.placeSearch.keywordSearch(
      keyword,
      this.placesSearchCB.bind(this)
    );
  }

  // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
  placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
      // 정상적으로 검색이 완료됐으면
      // 검색 목록과 마커를 표출합니다
      this.displayPlaces(data);

      // 페이지 번호를 표출합니다
      this.displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  }

  displayPlaces(places) {
    var listEl = document.getElementById("placesList"),
      menuEl = document.getElementById("menu_wrap"),
      fragment = document.createDocumentFragment(),
      bounds = new kakao.maps.LatLngBounds(),
      listStr = "";

    // 검색 결과 목록에 추가된 항목들을 제거합니다
    // 페이지별로 보여주기 때문에 추가한 것 같음.
    this.removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    this.removeMarker();

    for (var i = 0; i < places.length; i++) {
      // 마커를 생성하고 지도에 표시합니다
      var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
        marker = this.addMarker(placePosition, i),
        itemEl = this.getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      bounds.extend(placePosition);

      // 마커와 검색결과 항목에 mouseover 했을때
      // 해당 장소에 인포윈도우에 장소명을 표시합니다
      // mouseout 했을 때는 인포윈도우를 닫습니다
      ((marker, title) => {
        kakao.maps.event.addListener(marker, "click", () => {
          this.displayInfowindow(marker, title);
        });
        kakao.maps.event.addListener(marker, "mouseover", () => {
          this.displayInfowindow(marker, title);
        });

        itemEl.onmouseover = () => {
          this.displayInfowindow(marker, title);
        };
      })(marker, places[i].place_name);
      // 함수를 조건문처럼 사용하여 해당 함수가 true일때 marker,places[i].place_name함수가 불리워짐.

      fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    this.state.map.setBounds(bounds);
  }
  // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다
  closeOverlay() {
    this.state.infoWindow.setMap(null);
  }

  getListItem(index, places) {
    var el = document.createElement("li"),
      itemStr =
        '<span class="markerbg marker_' +
        (index + 1) +
        '"></span>' +
        '<div class="info">' +
        "   <h5>" +
        places.place_name +
        "</h5>";

    if (places.road_address_name) {
      itemStr +=
        "    <span>" +
        places.road_address_name +
        "</span>" +
        '   <span class="jibun gray">' +
        places.address_name +
        "</span>";
    } else {
      itemStr += "    <span>" + places.address_name + "</span>";
    }

    itemStr += '  <span class="tel">' + places.phone + "</span>" + "</div>";

    el.innerHTML = itemStr;
    el.className = "item";

    return el;
  }

  addMarker(position, idx, title) {
    var imageSrc =
        "http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
      imageSize = new kakao.maps.Size(36, 37), // 마커 이미지의 크기
      imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
        spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
        offset: new kakao.maps.Point(13, 37), // 마커 좌표에 일치시킬 이미지 내에서의 좌표
      },
      markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
      marker = new kakao.maps.Marker({
        position: position, // 마커의 위치
        image: markerImage,
      });

    marker.setMap(this.state.map); // 지도 위에 마커를 표출합니다
    this.setState({ curMarker: marker });
    this.state.markers.push(marker); // 배열에 생성된 마커를 추가합니다

    return marker;
  }

  // 지도 위에 표시되고 있는 마커를 모두 제거합니다
  removeMarker() {
    for (var i = 0; i < this.state.markers.length; i++) {
      this.state.markers[i].setMap(null);
    }
    this.setState({
      markers: [],
    });
  }

  // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
  displayPagination(pagination) {
    var paginationEl = document.getElementById("pagination"),
      fragment = document.createDocumentFragment(),
      i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
      paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
      var el = document.createElement("a");
      el.href = "#";
      el.innerHTML = i;

      if (i === pagination.current) {
        el.className = "on";
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i);
          };
        })(i);
      }

      fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
  }

  // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
  // 인포윈도우에 장소명을 표시합니다
  displayInfowindow(marker, title) {
    console.log(marker);

    let content = document.createElement("div");
    content.className = "wraps";

    let info = document.createElement("div");
    info.className = "infos";

    let titles = document.createElement("div");
    titles.className = "title";
    titles.innerHTML = title;

    let close = document.createElement("div");
    close.className = "close";
    close.onclick = () => {
      this.state.infoWindow.setMap(null);
    };

    let body = document.createElement("div");
    body.className = "body";
    let desc = document.createElement("div");
    let list = document.createElement("list");
    let second = document.createElement("LI");
    let br = document.createElement("div");
    br.innerHTML += "<br>";
    let second_ = document.createElement("LI");

    let getMise = document.createElement("Button");
    getMise.innerHTML = "미세먼지 정보";
    getMise.className = "info-button";
    getMise.onclick = () => {
      let position = marker.getPosition();
      console.log(marker.getPosition());
      console.log(position["Ga"]);
      API.get("/api/air-condition", {
        params: {
          latitude: position["Ha"],
          longitude: position["Ga"],
        },
      })
        .then((response) => {
          console.log("Success");
          console.log(response.data);
          this.setState({
            curAirCondition: response.data,
          });
        })
        .catch(function (error) {
          console.log(error);
        })
        .finally(function () {
          // always executed
        });
      API.get("api/air-condition/weather", {
        params: {
          latitude: position["Ha"],
          longitude: position["Ga"],
        },
      })
        .then((response) => {
          let resp = response["data"];
          console.log(resp);
          console.log("현재온도 : " + (resp.main.temp - 273.15));
          console.log("현재습도 : " + resp.main.humidity);
          console.log("날씨 : " + resp.weather[0].main);
          console.log("상세날씨설명 : " + resp.weather[0].description);
          console.log("날씨 이미지 : " + resp.weather[0].icon);
          console.log("바람   : " + resp.wind.speed);
          console.log("구름  : " + resp.clouds.all + "%");
          this.setState({
            temperature: (resp.main.temp - 273.15).toFixed(3),
            humidity: resp.main.humidity,
            weather: resp.weather[0].main,
            icon: resp.weather[0].icon,
            wind: resp.wind.speed,
            cloud: resp.clouds.all + "%",
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    let setDepart = document.createElement("Button");
    setDepart.innerHTML = "출발지로 설정하기";
    setDepart.onclick = () => {
      this.setState({
        departure: marker.getPosition(),
        departureTitle: title,
      });
    };
    setDepart.className = "info-button";
    let setArrive = document.createElement("Button");
    setArrive.innerHTML = "도착지로 설정하기";
    setArrive.onclick = () => {
      this.setState({
        arrival: marker.getPosition(),
        arrivalTitle: title,
      });
    };
    setArrive.className = "info-button";
    second.appendChild(getMise);
    second.appendChild(br);
    second_.appendChild(setDepart);
    second_.appendChild(setArrive);

    list.appendChild(second);
    list.appendChild(second_);
    desc.appendChild(list);
    body.appendChild(desc);
    titles.appendChild(close);
    info.appendChild(titles);
    info.appendChild(body);
    content.appendChild(info);

    this.state.infoWindow.setContent(content);
    this.state.infoWindow.setPosition(marker.getPosition());
    this.state.infoWindow.setMap(this.state.map);
  }
  getRouteAirCondition() {
    this.setState({
      buttonClicked: true,
    });
    API.get("/api/air-condition/route", {
      params: {
        departure: this.state.departure,
        arrival: this.state.arrival,
      },
    })
      .then((response) => {
        this.setState({
          routeInformation: response.data,
        });
        console.log(this.state.routeInformation);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }
  // 검색결과 목록의 자식 Element를 제거하는 함수입니다
  removeAllChildNods(el) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
  }

  componentDidMount() {
    // 컴포넌트가 만들어지고, render 함수가 호출된 이후에 호출되는 메소
    // AJAX나 타이머를 생성하는 코드를 작성하는 파트이다.
    let el = document.getElementById("map");
    this.setState({
      map: new kakao.maps.Map(el, {
        //map option 설정
        center: new kakao.maps.LatLng(37.503716, 127.044844),
        level: 3,
      }),
    });
    this.searchPlaces();
    // marker.setMap(map);
  }
  render() {
    let currentAirCondition = null;
    if (this.state.curAirCondition != null) {
      let pm10Image = null;
      let pm25Image = null;
      switch (this.state.curAirCondition.pm10Grade) {
        case "1":
          pm10Image = <img src={veryGood} width="50px" heigth="100px" />;
          break;
        case "2":
          pm10Image = <img src={good} width="50px" heigth="100px" />;
          break;
        case "3":
          pm10Image = <img src={bad} width="50px" heigth="100px" />;
          break;
        case "4":
          pm10Image = <img src={veryBad} width="50px" heigth="100px" />;
          break;
        default:
          pm10Image = null;
      }
      switch (this.state.curAirCondition.pm25Grade) {
        case "1":
          pm25Image = <img src={veryGood} width="50px" heigth="100px" />;
          break;
        case "2":
          pm25Image = <img src={good} width="50px" heigth="100px" />;
          break;
        case "3":
          pm25Image = <img src={bad} width="50px" heigth="100px" />;
          break;
        case "4":
          pm25Image = <img src={veryBad} width="50px" heigth="100px" />;
          break;
        default:
          pm25Image = null;
      }
      currentAirCondition = (
        <h5>
          <br />
          <br />
          <br /> 미세먼지 등급 <br /> {pm10Image} <br />
          미세먼지 지수 : {this.state.curAirCondition.pm10Value} <br />
          초미세먼지 등급 <br /> {pm25Image} <br />
          초미세먼지 지수 : {this.state.curAirCondition.pm25Value} <br />
          현재 온도 : {this.state.temperature} ℃ <br />
          현재 습도 : {this.state.humidity} <br />
          날씨 : {this.state.weather} <br />
          바람 : {this.state.wind} <br />
          구름 : {this.state.cloud} <br />{" "}
        </h5>
      );
    }
    let routeAirCondition = null;
    let tempRouteAirCondition = [];
    if (this.state.buttonClicked != null) {
      routeAirCondition = <img src={loading} width="300px" heigth="300px" />;
    }
    if (this.state.routeInformation != null) {
      for (let i = 0; i < this.state.routeInformation.length - 1; i++) {
        tempRouteAirCondition.push(this.state.routeInformation[i]);
      }
      let pm10ImageArray = new Array();
      let pm25ImageArray = new Array();
      for (let i = 0; i < this.state.routeInformation.length; i++) {
        let pm10Image = null;
        let pm25Image = null;
        switch (this.state.routeInformation[i]["airCondition"].pm10Grade) {
          case "1":
            pm10Image = <img src={veryGood} width="50px" heigth="100px" />;
            break;
          case "2":
            pm10Image = <img src={good} width="50px" heigth="100px" />;
            break;
          case "3":
            pm10Image = <img src={bad} width="50px" heigth="100px" />;
            break;
          case "4":
            pm10Image = <img src={veryBad} width="50px" heigth="100px" />;
            break;
          default:
            pm10Image = null;
        }
        switch (this.state.routeInformation[i]["airCondition"].pm25Grade) {
          case "1":
            pm25Image = <img src={veryGood} width="50px" heigth="100px" />;
            break;
          case "2":
            pm25Image = <img src={good} width="50px" heigth="100px" />;
            break;
          case "3":
            pm25Image = <img src={bad} width="50px" heigth="100px" />;
            break;
          case "4":
            pm25Image = <img src={veryBad} width="50px" heigth="100px" />;
            break;
          default:
            pm25Image = null;
        }
        pm10ImageArray[i] = pm10Image;
        pm25ImageArray[i] = pm25Image;
      }
      routeAirCondition = (
        <table>
          <thead>
            <tr>
              <th>
                <br />
                경로별 미세먼지 정보
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src={start} width="50px" heigth="30px" /> <br />
                <h6>
                  {this.state.departureTitle} <br /> 미세먼지 등급
                  <br />
                  {pm10ImageArray[this.state.routeInformation.length - 1]}
                  <br />
                  미세먼지 지수 :{" "}
                  {
                    this.state.routeInformation[
                      this.state.routeInformation.length - 1
                    ]["airCondition"].pm10Value
                  }
                  <br />
                </h6>
              </td>
              {tempRouteAirCondition.map((listValue, index) => {
                if (index != tempRouteAirCondition.length - 1) {
                  return (
                    <td key={index}>
                      <img src={next} width="40px" heigth="25px" />
                      <h6>
                        {listValue.instruction}
                        <br />
                        소요시간 : {listValue.duration}
                        <br />
                        미세먼지 등급
                        <br />
                        {pm10ImageArray[index]}
                        <br />
                        미세먼지 지수 : <br />
                        {listValue.airCondition.pm10Value}
                        <br />
                      </h6>
                    </td>
                  );
                } else {
                  return (
                    <td key={index}>
                      <img src={finish} width="50px" heigth="30px" />
                      <br />
                      <h6>
                        {listValue.instruction}
                        <br />
                        소요시간 : {listValue.duration}
                        <br />
                        미세먼지 등급
                        <br />
                        {pm10ImageArray[index]}
                        <br />
                        미세먼지 지수 : {listValue.airCondition.pm10Value}
                        <br />
                      </h6>
                    </td>
                  );
                }
              })}
            </tr>
          </tbody>
        </table>
      );
    }
    return (
      <section id="home">
        <div className="cover">
          <div className="Home-header">How's the Weather?!</div>
        </div>
        <div className="map_wrap">
          <div
            id="map"
            style={{ width: "1000px", height: "600px", align: "middle" }}
          ></div>
          <div id="menu_wrap" className="bg_white">
            <div className="option">
              지역 검색 :{" "}
              <input
                type="text"
                value={this.state.region}
                id="keyword"
                size="15"
                onChange={(e) => this.setState({ region: e.target.value })}
              />
              <Button variant="light" type="submit" onClick={this.searchPlaces}>
                검색하기
              </Button>
            </div>
            <ul id="placesList"></ul>
            <div id="pagination"></div>
          </div>
          <ul id="placesList"></ul>
          <div id="pagination"></div>
        </div>
        <div id="footer">
          <div className="left-box">
            <h5> 현재위치 : {this.state.region} </h5>
            <br />
            <div id="middle">{currentAirCondition}</div>
          </div>
          <div className="right-box">
            <h5>
              출발지 : {this.state.departureTitle} <br />
              도착지 : {this.state.arrivalTitle} <br />
              <Button variant="secondary" onClick={this.getRouteAirCondition}>
                {" "}
                경로별 미세먼지 정보 알아보기{" "}
              </Button>{" "}
              <br /> <br />
            </h5>
            <div id="middle">{routeAirCondition}</div>
          </div>
        </div>
      </section>
    );
  }
}
