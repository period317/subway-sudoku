/**
 * 서울 지하철 2호선 역 데이터베이스
 * 총 51개 역: 순환선 43 + 성수지선 4 + 신정지선 4
 *
 * passengers: 1일 평균 승차 인원 (서울교통공사 2023년 기준, 일부 추정치 포함)
 * depth: 지하 깊이 m (레일면 기준, 추정치)
 * opened: 해당 역 최초 개통일
 */

export const LINE2_STATIONS = [

  /* ── 순환선 (시청 → 시계방향) ── */

  {
    key: '시청',
    name: '시청',
    nameEn: 'City Hall',
    no: 201,
    branch: 'main',
    opened: '1983-06-30',
    depth: 15,
    passengers: { weekday: 43200, weekend: 29400 },
    nameOrigin:
      '조선 한성부 관아가 있던 자리. 지금의 서울특별시청(市廳)이 자리해 붙은 이름으로, ' +
      '일제강점기 경성부청 시절부터 이미 "시청" 일대로 불렸다.',
  },
  {
    key: '을지로입구',
    name: '을지로입구',
    nameEn: 'Euljiro 1(il)-ga',
    no: 202,
    branch: 'main',
    opened: '1982-12-23',
    depth: 16,
    passengers: { weekday: 22800, weekend: 18600 },
    nameOrigin:
      '을지로(乙支路)의 입구. 을지로는 고구려 살수대첩의 영웅 을지문덕(乙支文德) 장군의 성(姓) ' +
      '"을지"를 딴 도로명이다. 1946년 일제식 "황금정(黃金町)"을 을지로로 개칭.',
  },
  {
    key: '을지로3가',
    name: '을지로3가',
    nameEn: 'Euljiro 3(sam)-ga',
    no: 203,
    branch: 'main',
    opened: '1982-12-23',
    depth: 17,
    passengers: { weekday: 19500, weekend: 14200 },
    nameOrigin:
      '을지로 3가 교차로 일대. 조선시대 "황학동" 인근으로 공구·철물 상가가 밀집해 ' +
      '"공구 거리"로도 유명하다.',
  },
  {
    key: '을지로4가',
    name: '을지로4가',
    nameEn: 'Euljiro 4(sa)-ga',
    no: 204,
    branch: 'main',
    opened: '1982-12-23',
    depth: 17,
    passengers: { weekday: 16300, weekend: 11800 },
    nameOrigin:
      '을지로 4가 교차로. 인쇄·제본 산업의 메카로 "인쇄 골목"이 형성돼 있어 ' +
      '출판사와 인쇄소가 한데 모여 있다.',
  },
  {
    key: '동대문역사',
    name: '동대문역사문화공원',
    nameEn: 'Dongdaemun History & Culture Park',
    no: 205,
    branch: 'main',
    opened: '1982-12-23',
    depth: 22,
    passengers: { weekday: 27600, weekend: 32100 },
    nameOrigin:
      '조선 도성(都城)의 동쪽 정문 동대문(東大門, 흥인지문)에서 유래. 옛 동대문운동장을 ' +
      '철거 후 역사문화공원으로 조성해 2009년 역명도 변경됐다.',
  },
  {
    key: '신당',
    name: '신당',
    nameEn: 'Sindang',
    no: 206,
    branch: 'main',
    opened: '1982-12-23',
    depth: 18,
    passengers: { weekday: 14800, weekend: 12300 },
    nameOrigin:
      '예부터 무속 신앙의 신당(神堂, 당집)이 여럿 있던 마을. 한국전쟁 이후 ' +
      '"떡볶이 골목"이 형성돼 서민 먹거리의 성지로 자리잡았다.',
  },
  {
    key: '상왕십리',
    name: '상왕십리',
    nameEn: 'Sangwangsimni',
    no: 207,
    branch: 'main',
    opened: '1982-12-23',
    depth: 18,
    passengers: { weekday: 9200, weekend: 7400 },
    nameOrigin:
      '왕십리(往十里)의 위쪽(上) 마을. 왕십리는 "조선 태조가 도성 터를 찾아 ' +
      '10리를 더 가라는 무학대사의 말에서" 유래했다는 설이 전해진다.',
  },
  {
    key: '왕십리',
    name: '왕십리',
    nameEn: 'Wangsimni',
    no: 208,
    branch: 'main',
    opened: '1982-12-23',
    depth: 20,
    passengers: { weekday: 35400, weekend: 24800 },
    nameOrigin:
      '"왕이 십 리를 가다(往十里)". 조선 태조 이성계가 새 도읍지 입지를 고르던 중 ' +
      '무학대사가 "여기서 십 리를 더 가라" 했다는 전설에서 비롯됐다.',
  },
  {
    key: '한양대',
    name: '한양대',
    nameEn: 'Hanyang Univ.',
    no: 209,
    branch: 'main',
    opened: '1982-12-23',
    depth: 19,
    passengers: { weekday: 18600, weekend: 11200 },
    nameOrigin:
      '한양대학교(漢陽大學校) 정문 앞에 위치. 한양(漢陽)은 한강(漢江)의 북쪽 양지 ' +
      '즉 서울의 옛 이름이다.',
  },
  {
    key: '뚝섬',
    name: '뚝섬',
    nameEn: 'Ttukseom',
    no: 210,
    branch: 'main',
    opened: '1982-12-23',
    depth: 18,
    passengers: { weekday: 13500, weekend: 16800 },
    nameOrigin:
      '뚝(纛)섬. 조선 군대의 군기(軍旗) "독기(纛旗)"를 보관·제작하던 섬이었다. ' +
      '지금은 한강변 수변공원으로 바뀌어 서울 시민의 휴식처가 됐다.',
  },
  {
    key: '성수',
    name: '성수',
    nameEn: 'Seongsu',
    no: 211,
    branch: 'main',
    opened: '1982-12-23',
    depth: 17,
    passengers: { weekday: 21400, weekend: 19600 },
    nameOrigin:
      '성수동(聖水洞). "성스러운 물(聖水)"이 나오는 곳이라는 뜻. ' +
      '근년에는 수제화 거리와 힙한 카페로 뜨는 핫플이 됐다.',
  },
  {
    key: '건대입구',
    name: '건대입구',
    nameEn: 'Konkuk Univ.',
    no: 212,
    branch: 'main',
    opened: '1980-10-31',
    depth: 19,
    passengers: { weekday: 47200, weekend: 38600 },
    nameOrigin:
      '건국대학교(建國大學校) 입구. 건국(建國)은 나라를 세운다는 의미로 ' +
      '1946년 개교 당시 민족 독립의 염원을 담았다.',
  },
  {
    key: '구의',
    name: '구의',
    nameEn: 'Guui',
    no: 213,
    branch: 'main',
    opened: '1980-10-31',
    depth: 16,
    passengers: { weekday: 14600, weekend: 10200 },
    nameOrigin:
      '구의동(九宜洞). "아홉 가지가 알맞은(九宜) 곳"이라는 뜻으로 ' +
      '지세와 물과 바람이 두루 좋다는 데서 유래했다.',
  },
  {
    key: '강변',
    name: '강변',
    nameEn: 'Gangbyeon',
    no: 214,
    branch: 'main',
    opened: '1980-10-31',
    depth: 14,
    passengers: { weekday: 22800, weekend: 18400 },
    nameOrigin:
      '한강변(漢江邊)에 자리한 역. 인근 동서울터미널(동서울종합버스터미널)과 ' +
      '연계되어 경기 동부·강원권 버스 환승 거점이다.',
  },
  {
    key: '잠실나루',
    name: '잠실나루',
    nameEn: 'Jamsillaru',
    no: 215,
    branch: 'main',
    opened: '1980-10-31',
    depth: 14,
    passengers: { weekday: 11200, weekend: 9400 },
    nameOrigin:
      '잠실(蠶室)의 나루터(渡船場). 잠실은 조선시대 누에(蠶)를 치던 섬이었으며, ' +
      '한강을 건너는 나루가 있어 "잠실나루"로 불렸다.',
  },
  {
    key: '잠실',
    name: '잠실',
    nameEn: 'Jamsil',
    no: 216,
    branch: 'main',
    opened: '1980-10-31',
    depth: 16,
    passengers: { weekday: 76400, weekend: 68200 },
    nameOrigin:
      '잠실(蠶室). 조선 왕실이 누에(蠶)를 길러 비단 원료를 공급하던 섬(室). ' +
      '1971년 한강 지류가 매립되어 육지가 됐고, 지금은 서울 최대 복합 상권이다.',
  },
  {
    key: '잠실새내',
    name: '잠실새내',
    nameEn: 'Jamsil Saenae',
    no: 217,
    branch: 'main',
    opened: '1980-10-31',
    depth: 15,
    passengers: { weekday: 14800, weekend: 12600 },
    nameOrigin:
      '"새내(新川)"는 "새로 만들어진 내(川)"라는 순우리말. ' +
      '1971년 한강 매립 공사로 생긴 새 물길 옆에 있어 붙은 이름이다.',
  },
  {
    key: '종합운동장',
    name: '종합운동장',
    nameEn: 'Sports Complex',
    no: 218,
    branch: 'main',
    opened: '1980-10-31',
    depth: 17,
    passengers: { weekday: 18600, weekend: 22400 },
    nameOrigin:
      '1988 서울 올림픽 주경기장(잠실올림픽주경기장)을 포함한 서울 종합운동장(KSSC)에 접해 있다. ' +
      '경기 있는 날이면 하루 이용객이 2배 이상 급증한다.',
  },
  {
    key: '삼성',
    name: '삼성',
    nameEn: 'Samsung',
    no: 219,
    branch: 'main',
    opened: '1983-09-16',
    depth: 22,
    passengers: { weekday: 32600, weekend: 22400 },
    nameOrigin:
      '삼성동(三成洞). "세 개의 성(城)"을 뜻하는 이름으로, ' +
      '조선시대 이 일대에 세 개의 작은 토성이 있었다는 설이 있다.',
  },
  {
    key: '선릉',
    name: '선릉',
    nameEn: 'Seolleung',
    no: 220,
    branch: 'main',
    opened: '1983-09-16',
    depth: 21,
    passengers: { weekday: 41800, weekend: 27600 },
    nameOrigin:
      '선릉(宣陵). 조선 9대 성종(成宗)의 능(陵). ' +
      '인근에 중종의 능인 정릉(靖陵)도 있어 "선릉·정릉" 역사공원으로 묶여 있다.',
  },
  {
    key: '역삼',
    name: '역삼',
    nameEn: 'Yeoksam',
    no: 221,
    branch: 'main',
    opened: '1983-09-16',
    depth: 20,
    passengers: { weekday: 39400, weekend: 24800 },
    nameOrigin:
      '역삼동(驛三洞). "역(驛)이 있던 세(三) 마을"에서 유래. ' +
      '조선시대 역참(驛站·파발마 교환소)이 있던 자리로, IT 스타트업 밀집 지역이다.',
  },
  {
    key: '강남',
    name: '강남',
    nameEn: 'Gangnam',
    no: 222,
    branch: 'main',
    opened: '1983-09-16',
    depth: 20,
    passengers: { weekday: 87400, weekend: 64200 },
    nameOrigin:
      '한강(漢江)의 남쪽(南) 강남(江南). 1970년대 대규모 개발로 ' +
      '"강남 8학군"이 형성되면서 대한민국 교육·부동산의 상징어가 됐다.',
  },
  {
    key: '교대',
    name: '교대',
    nameEn: 'Seoul Nat\'l Univ. of Education',
    no: 223,
    branch: 'main',
    opened: '1983-09-16',
    depth: 21,
    passengers: { weekday: 28400, weekend: 19600 },
    nameOrigin:
      '서울교육대학교(교대) 인근에서 유래. 교육대학교(教育大學校)의 줄임말이 역명이 됐으며, ' +
      '3호선과의 환승역이기도 하다.',
  },
  {
    key: '서초',
    name: '서초',
    nameEn: 'Seocho',
    no: 224,
    branch: 'main',
    opened: '1983-09-16',
    depth: 22,
    passengers: { weekday: 23200, weekend: 16800 },
    nameOrigin:
      '서초동(瑞草洞). "상서로운(瑞) 풀(草)이 자라는 곳". ' +
      '법원·검찰청이 밀집해 "법조 타운"으로도 불린다.',
  },
  {
    key: '방배',
    name: '방배',
    nameEn: 'Bangbae',
    no: 225,
    branch: 'main',
    opened: '1983-09-16',
    depth: 20,
    passengers: { weekday: 14600, weekend: 10800 },
    nameOrigin:
      '방배동(方背洞). 한강을 등지고 앉은 네모난 지형이라 "방배(方背)"라 불렸다는 설. ' +
      '"카페골목"과 고급 주택가로 알려진 주거 중심지다.',
  },
  {
    key: '사당',
    name: '사당',
    nameEn: 'Sadang',
    no: 226,
    branch: 'main',
    opened: '1983-09-16',
    depth: 19,
    passengers: { weekday: 38600, weekend: 28400 },
    nameOrigin:
      '사당동(祠堂洞). 예부터 조상의 위패를 모신 사당(祠堂)이 있던 마을. ' +
      '경기남부 버스 환승의 핵심 거점으로, 출퇴근 혼잡도가 2호선 최상위권이다.',
  },
  {
    key: '낙성대',
    name: '낙성대',
    nameEn: 'Nakseongdae',
    no: 227,
    branch: 'main',
    opened: '1983-09-16',
    depth: 24,
    passengers: { weekday: 16800, weekend: 12400 },
    nameOrigin:
      '낙성대(落星垈). "별이 떨어진 터". 고려 현종 때 강감찬 장군이 태어날 때 ' +
      '큰 별이 떨어졌다는 전설이 있어 그 터를 낙성대라 불렀다.',
  },
  {
    key: '서울대입구',
    name: '서울대입구',
    nameEn: 'Seoul Nat\'l Univ.',
    no: 228,
    branch: 'main',
    opened: '1983-09-16',
    depth: 26,
    passengers: { weekday: 45800, weekend: 34600 },
    nameOrigin:
      '서울대학교(서울대) 입구 쪽에 위치해 붙은 이름. ' +
      '실제 서울대 정문까지는 버스로 환승해야 하며, 관악산 등산객도 많이 이용한다.',
  },
  {
    key: '봉천',
    name: '봉천',
    nameEn: 'Bongcheon',
    no: 229,
    branch: 'main',
    opened: '1983-09-16',
    depth: 25,
    passengers: { weekday: 24800, weekend: 17600 },
    nameOrigin:
      '봉천동(奉天洞). "하늘(天)을 받드는(奉) 동네". ' +
      '관악산 기슭의 가파른 산동네로 1970~80년대 서울 이주민이 많이 정착한 곳이다.',
  },
  {
    key: '신림',
    name: '신림',
    nameEn: 'Sillim',
    no: 230,
    branch: 'main',
    opened: '1983-09-16',
    depth: 22,
    passengers: { weekday: 54200, weekend: 38600 },
    nameOrigin:
      '신림동(新林洞). "새로운(新) 숲(林)이 있는 곳". ' +
      '고시촌·공무원 준비생 집결지로 유명하며, 최근에는 "신림선" 개통으로 교통 요충지가 됐다.',
  },
  {
    key: '신대방',
    name: '신대방',
    nameEn: 'Sindaebang',
    no: 231,
    branch: 'main',
    opened: '1983-09-16',
    depth: 19,
    passengers: { weekday: 18600, weekend: 13200 },
    nameOrigin:
      '신대방동(新大方洞). "새로운 대방" 이라는 뜻으로 ' +
      '구 대방동(大方洞)에서 분리·신설된 마을이다.',
  },
  {
    key: '구로디지털',
    name: '구로디지털단지',
    nameEn: 'Guro Digital Complex',
    no: 232,
    branch: 'main',
    opened: '1984-05-22',
    depth: 18,
    passengers: { weekday: 49400, weekend: 28800 },
    nameOrigin:
      '옛 구로공단(九老工團). 1960~90년대 섬유·봉제 수출 공장이 모인 곳이었으나 ' +
      '2000년대 IT 벤처 단지로 탈바꿈해 역명도 "구로디지털단지"로 변경됐다(2005년).',
  },
  {
    key: '대림',
    name: '대림',
    nameEn: 'Daerim',
    no: 233,
    branch: 'main',
    opened: '1984-05-22',
    depth: 17,
    passengers: { weekday: 28600, weekend: 21400 },
    nameOrigin:
      '대림동(大林洞). "큰(大) 숲(林)". 예부터 큰 나무숲이 있던 마을에서 유래. ' +
      '현재는 중국 동포(조선족) 밀집 거주 지역으로 독특한 이중 문화가 형성돼 있다.',
  },
  {
    key: '신도림',
    name: '신도림',
    nameEn: 'Sindorim',
    no: 234,
    branch: 'main',
    opened: '1984-05-22',
    depth: 17,
    passengers: { weekday: 53400, weekend: 36200 },
    nameOrigin:
      '신도림동(新道林洞). 도림천(桃林川) 근처에 새로 생긴 마을. ' +
      '도림(桃林)은 복숭아나무 숲을 뜻한다. 1호선과의 환승역으로 서울 서남권 최대 환승 거점이다.',
  },
  {
    key: '문래',
    name: '문래',
    nameEn: 'Mullae',
    no: 235,
    branch: 'main',
    opened: '1984-05-22',
    depth: 16,
    passengers: { weekday: 18200, weekend: 12800 },
    nameOrigin:
      '문래동(文來洞). 실을 감는 기구 "물레"에서 유래. 일제강점기에 방적·방직 공장이 들어서면서 ' +
      '"물레질하는 곳"이라는 의미로 붙여졌다. 지금은 철공소와 예술가 작업실이 공존하는 독특한 동네.',
  },
  {
    key: '영등포구청',
    name: '영등포구청',
    nameEn: 'Yeongdeungpo-gu Office',
    no: 236,
    branch: 'main',
    opened: '1984-05-22',
    depth: 14,
    passengers: { weekday: 16600, weekend: 11400 },
    nameOrigin:
      '영등포(永登浦). "영원히(永) 오르는(登) 포구(浦)". 조선시대 한강 나루가 있던 곳. ' +
      '영등포구청(永登浦區廳)이 인근에 위치해 역명이 됐다.',
  },
  {
    key: '당산',
    name: '당산',
    nameEn: 'Dangsan',
    no: 237,
    branch: 'main',
    opened: '1984-05-22',
    depth: 14,
    passengers: { weekday: 28800, weekend: 21600 },
    nameOrigin:
      '당산동(堂山洞). 마을 수호신을 모신 당집(堂)이 있는 산(山)에서 유래. ' +
      '9호선과의 환승역으로 여의도·강남 방면 환승 수요가 많다.',
  },
  {
    key: '합정',
    name: '합정',
    nameEn: 'Hapjeong',
    no: 238,
    branch: 'main',
    opened: '1984-05-22',
    depth: 16,
    passengers: { weekday: 33200, weekend: 30400 },
    nameOrigin:
      '합정동(合井洞). "여러 우물(井)이 합쳐진(合) 곳". 또는 땅 모양이 합(盒·뚜껑 있는 그릇)처럼 ' +
      '생긴 우물이 있던 곳이라는 설도 있다. 6호선 환승역.',
  },
  {
    key: '홍대입구',
    name: '홍대입구',
    nameEn: 'Hongik Univ.',
    no: 239,
    branch: 'main',
    opened: '1984-05-22',
    depth: 18,
    passengers: { weekday: 63800, weekend: 72400 },
    nameOrigin:
      '홍익대학교(弘益大學校) 입구. 홍익(弘益)은 "널리 인간을 이롭게 한다"는 건국이념. ' +
      '인디 음악·그래피티 문화의 발상지로, 주말 이용객이 평일보다 많은 드문 역이다.',
  },
  {
    key: '신촌',
    name: '신촌',
    nameEn: 'Sinchon',
    no: 240,
    branch: 'main',
    opened: '1984-05-22',
    depth: 15,
    passengers: { weekday: 28600, weekend: 30200 },
    nameOrigin:
      '신촌(新村). "새로운(新) 마을(村)". 경기 서북부에서 서울로 들어오는 초입에 ' +
      '새로 형성된 마을이라는 뜻. 연세대·이화여대 등 대학가 상권의 중심이다.',
  },
  {
    key: '이대',
    name: '이대',
    nameEn: 'Ewha Womans Univ.',
    no: 241,
    branch: 'main',
    opened: '1984-05-22',
    depth: 15,
    passengers: { weekday: 22400, weekend: 21800 },
    nameOrigin:
      '이화여자대학교(梨花女子大學校) 인근. 이화(梨花)는 "배꽃". ' +
      '1886년 설립된 한국 최초의 근대 여성 교육기관 이름을 역명으로 쓴다.',
  },
  {
    key: '아현',
    name: '아현',
    nameEn: 'Ahyeon',
    no: 242,
    branch: 'main',
    opened: '1984-05-22',
    depth: 17,
    passengers: { weekday: 14200, weekend: 10400 },
    nameOrigin:
      '아현동(阿峴洞). "아이고개". 예부터 어린아이(阿)들이 넘어 다니던 작은 고개(峴)가 있어 붙은 이름. ' +
      '순우리말 "애오개"로도 불리며, 5호선 애오개역이 바로 인근이다.',
  },
  {
    key: '충정로',
    name: '충정로',
    nameEn: 'Chungjeongno',
    no: 243,
    branch: 'main',
    opened: '1984-05-22',
    depth: 16,
    passengers: { weekday: 17600, weekend: 12400 },
    nameOrigin:
      '충정로(忠正路). 대한제국 충정공(忠正公) 민영환(閔泳煥)의 시호(諡號)를 딴 도로명. ' +
      '1905년 을사조약에 항거해 자결한 민영환을 기리기 위해 명명됐다.',
  },

  /* ── 성수지선 (성수 → 신설동, 4개 추가 역) ── */

  {
    key: '용답',
    name: '용답',
    nameEn: 'Yongdap',
    no: '211-1',
    branch: 'seongsu',
    opened: '1980-10-31',
    depth: 12,
    passengers: { weekday: 2600, weekend: 1800 },
    nameOrigin:
      '용답동(龍踏洞). "용(龍)이 밟고(踏) 간 땅". 이 일대에 용이 발자국을 남겼다는 전설에서 유래. ' +
      '성수지선 중 가장 이용객이 적어 서울 지하철 최저 이용역 순위에 자주 오른다.',
  },
  {
    key: '신답',
    name: '신답',
    nameEn: 'Sindap',
    no: '211-2',
    branch: 'seongsu',
    opened: '1980-10-31',
    depth: 11,
    passengers: { weekday: 3200, weekend: 2200 },
    nameOrigin:
      '신답동(新畓洞). "새로(新) 만든 논(畓)". 조선 후기 이 일대의 개간된 논에서 유래. ' +
      '한때 "서울에서 가장 조용한 역"으로 불릴 만큼 이용객이 적다.',
  },
  {
    key: '용두',
    name: '용두',
    nameEn: 'Yongdu',
    no: '211-3',
    branch: 'seongsu',
    opened: '1980-10-31',
    depth: 12,
    passengers: { weekday: 3600, weekend: 2600 },
    nameOrigin:
      '용두동(龍頭洞). "용(龍)의 머리(頭)". 청계천과 중랑천이 만나는 지점의 지형이 ' +
      '용의 머리처럼 생겼다 하여 붙은 이름이다.',
  },
  {
    key: '신설동',
    name: '신설동',
    nameEn: 'Sinseol-dong',
    no: '211-4',
    branch: 'seongsu',
    opened: '1980-10-31',
    depth: 15,
    passengers: { weekday: 7400, weekend: 5200 },
    nameOrigin:
      '신설동(新設洞). "새로(新) 설치(設)된 동네". 일제강점기 도심 확장 과정에서 ' +
      '신설된 행정구역. 1호선 환승역이기도 하며, 성수지선의 종착역이다.',
  },

  /* ── 신정지선 (신도림 → 까치산, 4개 추가 역) ── */

  {
    key: '도림천',
    name: '도림천',
    nameEn: 'Dorimcheon',
    no: '234-1',
    branch: 'sinjeong',
    opened: '1996-03-30',
    depth: 14,
    passengers: { weekday: 5800, weekend: 4200 },
    nameOrigin:
      '도림천(桃林川). "복숭아(桃) 숲(林) 사이를 흐르는 내(川)". ' +
      '조선시대 이 일대에 복숭아나무 숲이 우거져 있었다는 데서 유래한 하천 이름이 역명이 됐다.',
  },
  {
    key: '양천구청',
    name: '양천구청',
    nameEn: 'Yangcheon-gu Office',
    no: '234-2',
    branch: 'sinjeong',
    opened: '1996-03-30',
    depth: 14,
    passengers: { weekday: 8200, weekend: 5800 },
    nameOrigin:
      '양천(陽川). "양지(陽) 바른 내(川)가 있는 곳". 고려·조선 시대 양천현(陽川縣)으로 ' +
      '불리던 지역이며, 강서구에서 분리된 양천구청(陽川區廳)이 인근에 위치한다.',
  },
  {
    key: '신정네거리',
    name: '신정네거리',
    nameEn: 'Sinjeong Rotary',
    no: '234-3',
    branch: 'sinjeong',
    opened: '1996-03-30',
    depth: 13,
    passengers: { weekday: 9400, weekend: 6800 },
    nameOrigin:
      '신정동(新井洞) 네거리. "새로운(新) 우물(井)이 있는 동네"의 사거리. ' +
      '신정동은 조선시대 새로 판 우물이 있던 마을에서 이름을 딴 것으로 전해진다.',
  },
  {
    key: '까치산',
    name: '까치산',
    nameEn: 'Kkachisan',
    no: '234-4',
    branch: 'sinjeong',
    opened: '1996-03-30',
    depth: 13,
    passengers: { weekday: 14800, weekend: 11200 },
    nameOrigin:
      '"까치들이 많이 살던 산". 예부터 이 동네 뒷산에 까치가 많이 서식해 " 까치산"이라 불렸다. ' +
      '5호선과의 환승역으로 신정지선 종착역이기도 하다.',
  },
];

/**
 * key로 역 데이터를 빠르게 조회하는 Map
 */
export const LINE2_STATION_MAP = new Map(
  LINE2_STATIONS.map(s => [s.key, s])
);

/**
 * 지선별 역 목록
 */
export const LINE2_BY_BRANCH = {
  main:     LINE2_STATIONS.filter(s => s.branch === 'main'),
  seongsu:  LINE2_STATIONS.filter(s => s.branch === 'seongsu'),
  sinjeong: LINE2_STATIONS.filter(s => s.branch === 'sinjeong'),
};
