import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCSessionDescriptionType,
  RTCView,
} from 'react-native-webrtc';

function MyPage() {
  const wsURL = 'wss://cd13a3.entrypoint.cloud.wowza.com/webrtc-session.json';
  const streamInfo = {
    applicationName: 'app-hPvW66H5',
    streamName: 'M1NvdVE2',
    sessionId: '[empty]',
  };

  // 백엔드 자체세팅 가능
  let wsConnection: WebSocket | null;
  let config = {
    iceServers: [],
  };
  let newAPI = false;
  let videoBitrate = 360;
  let audioBitrate = 64;
  let videoFrameRate = '29.97';
  let userData = {param1: 'value1'};
  let peerConnection: RTCPeerConnection;

  const [mediaInfos, setMediaInfos] = useState<{sourceId: string}[]>([]);
  const [stream, setStream] = useState<MediaStream>();

  //맨처음 시작 요청점
  useEffect(() => {
    getSourceInfos();
  }, []);

  // front 미디어 인포 가져오기 요청점
  useEffect(() => {
    if (mediaInfos.length) {
      setMediaHandler();
    }
  }, [mediaInfos]);

  // front 미디어 인포 가져오기
  const setMediaHandler = () => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          facingMode: 'user',
          mandatory: {
            minWidth: 640,
            minHeight: 480,
            minFrameRate: 30,
          },
          optional: mediaInfos,
        },
      })
      .then(media => {
        setStream(media);
        console.log(media);
      })
      .catch(e => console.log(e));
  };

  // front 미디어 인포 가져오기
  const getSourceInfos = () => {
    mediaDevices
      .enumerateDevices()
      .then(sourceInfos => {
        for (let i = 0; i < sourceInfos.length; i++) {
          const el = sourceInfos[i];

          if (el.kind === 'videoinput' && el.facing === 'front') {
            setMediaInfos(prev => [...prev, {sourceId: el.deviceId}]);
          }
        }
      })
      .catch(e => console.log('🐞 ', e));
  };
  //방송시작
  const startPublisher = () => {
    wsConnect(wsURL);
  };

  const wsConnect = (url: string) => {
    console.log('🧑🏻‍💻');
    wsConnection = new WebSocket(url);

    wsConnection.onopen = async () => {
      peerConnection = await new RTCPeerConnection(config);

      peerConnection.onicecandidate = e => {
        console.log('peerConnection.onicecandidate', e);
      };
      if (newAPI) {
        // const res = stream?.getTracks();
      } else {
        peerConnection.addStream(stream!);
      }

      peerConnection
        .createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        })
        .then((value: RTCSessionDescriptionType) => gotDescription(value))
        .catch(e => console.log('eee', e));
    };
    //onOpen
    wsConnection.onmessage = function (evt) {
      console.log('wsConnection.onmessage: ' + evt.data);

      let msgJSON = JSON.parse(evt.data);

      let msgStatus = Number(msgJSON['status']);

      if (msgStatus !== 200) {
        stopPublisher();
      } else {
        let sdpData = msgJSON['sdp'];
        if (sdpData !== undefined) {
          console.log('sdp: ' + msgJSON['sdp']);

          peerConnection
            .setRemoteDescription(new RTCSessionDescription(sdpData))
            .then(() => console.log('🍎', 'sdpData'))
            .catch(e => console.log('📱', e));
        }
        let iceCandidates = msgJSON['iceCandidates'];
        if (iceCandidates !== undefined) {
          for (let index in iceCandidates) {
            console.log('iceCandidates: ' + iceCandidates[index]);

            peerConnection.addIceCandidate(
              new RTCIceCandidate(iceCandidates[index]),
            );
          }
        }
      }

      if (wsConnection !== null) {
        wsConnection.close();
      }
      wsConnection = null;
    };

    wsConnection.onclose = function () {
      console.log('wsConnection.onclose');
    };

    wsConnection.onerror = function (evt) {
      console.log('wsConnection.onerror: ' + JSON.stringify(evt));
      stopPublisher();
    };
  };
  const stopPublisher = () => {};

  const gotDescription = (description: RTCSessionDescriptionType) => {
    let enhanceData: any = new Object();

    if (audioBitrate !== undefined) {
      enhanceData.audioBitrate = Number(audioBitrate);
    }
    if (videoBitrate !== undefined) {
      enhanceData.videoBitrate = Number(videoBitrate);
    }
    if (videoFrameRate !== undefined) {
      enhanceData.videoFrameRate = Number(videoFrameRate);
    }

    // description.sdp = enhanceSDP(description.sdp, enhanceData);

    console.log('gotDescription: ' + JSON.stringify({sdp: description}));

    peerConnection
      .setLocalDescription(description)
      .then(() => {
        wsConnection!.send(
          '{"direction":"publish", "command":"sendOffer", "streamInfo":' +
            JSON.stringify(streamInfo) +
            ', "sdp":' +
            JSON.stringify(description) +
            ', "userData":' +
            JSON.stringify(userData) +
            '}',
        );
      })
      .catch(e => console.log('🙌', e));
  };

  // const enhanceSDP = (
  //   sdpStr: string,
  //   enhanceData: {
  //     audioBitrate: number;
  //     videoBitrate: number;
  //     videoFrameRate: number;
  //   },
  // ) => {
  //   let sdpLines = sdpStr.split(/\r\n/);
  //   let sdpSection = 'header';
  //   let hitMID = false;
  //   let sdpStrRet = '';
  //   //console.log("Original SDP: "+sdpStr);
  //   // Firefox provides a reasonable SDP, Chrome is just odd
  //   // so we have to doing a little mundging to make it all work
  //   if (!sdpStr.includes('THIS_IS_SDPARTA') || videoChoice.includes('VP9')) {
  //     for (let sdpIndex in sdpLines) {
  //       let sdpLine = sdpLines[sdpIndex];
  //       if (sdpLine.length <= 0) continue;
  //       let doneCheck = checkLine(sdpLine);
  //       if (!doneCheck) continue;
  //       sdpStrRet += sdpLine;
  //       sdpStrRet += '\r\n';
  //     }
  //     sdpStrRet = addAudio(sdpStrRet, deliverCheckLine(audioChoice, 'audio'));
  //     sdpStrRet = addVideo(sdpStrRet, deliverCheckLine(videoChoice, 'video'));
  //     sdpStr = sdpStrRet;
  //     sdpLines = sdpStr.split(/\r\n/);
  //     sdpStrRet = '';
  //   }
  //   for (let sdpIndex in sdpLines) {
  //     let sdpLine = sdpLines[sdpIndex];
  //     if (sdpLine.length <= 0) continue;
  //     if (sdpLine.indexOf('m=audio') === 0 && audioIndex !== -1) {
  //       const audioMLines = sdpLine.split(' ');
  //       sdpStrRet +=
  //         audioMLines[0] +
  //         ' ' +
  //         audioMLines[1] +
  //         ' ' +
  //         audioMLines[2] +
  //         ' ' +
  //         audioIndex +
  //         '\r\n';
  //       continue;
  //     }
  //     if (sdpLine.indexOf('m=video') === 0 && videoIndex !== -1) {
  //       const audioMLines = sdpLine.split(' ');
  //       sdpStrRet +=
  //         audioMLines[0] +
  //         ' ' +
  //         audioMLines[1] +
  //         ' ' +
  //         audioMLines[2] +
  //         ' ' +
  //         videoIndex +
  //         '\r\n';
  //       continue;
  //     }
  //     sdpStrRet += sdpLine;
  //     if (sdpLine.indexOf('m=audio') === 0) {
  //       sdpSection = 'audio';
  //       hitMID = false;
  //     } else if (sdpLine.indexOf('m=video') === 0) {
  //       sdpSection = 'video';
  //       hitMID = false;
  //     } else if (sdpLine.indexOf('a=rtpmap') === 0) {
  //       sdpSection = 'bandwidth';
  //       hitMID = false;
  //     }
  //     if (
  //       sdpLine.indexOf('a=mid:') === 0 ||
  //       sdpLine.indexOf('a=rtpmap') === 0
  //     ) {
  //       if (!hitMID) {
  //         if ('audio'.localeCompare(sdpSection) === 0) {
  //           if (enhanceData.audioBitrate !== undefined) {
  //             sdpStrRet += '\r\nb=CT:' + enhanceData.audioBitrate;
  //             sdpStrRet += '\r\nb=AS:' + enhanceData.audioBitrate;
  //           }
  //           hitMID = true;
  //         } else if ('video'.localeCompare(sdpSection) === 0) {
  //           if (enhanceData.videoBitrate !== undefined) {
  //             sdpStrRet += '\r\nb=CT:' + enhanceData.videoBitrate;
  //             sdpStrRet += '\r\nb=AS:' + enhanceData.videoBitrate;
  //             if (enhanceData.videoFrameRate !== undefined) {
  //               sdpStrRet += '\r\na=framerate:' + enhanceData.videoFrameRate;
  //             }
  //           }
  //           hitMID = true;
  //         } else if ('bandwidth'.localeCompare(sdpSection) === 0) {
  //           let rtpmapID;
  //           rtpmapID = getrtpMapID(sdpLine);
  //           if (rtpmapID !== null) {
  //             let match = rtpmapID[2].toLowerCase();
  //             if (
  //               'vp9'.localeCompare(match) === 0 ||
  //               'vp8'.localeCompare(match) === 0 ||
  //               'h264'.localeCompare(match) === 0 ||
  //               'red'.localeCompare(match) === 0 ||
  //               'ulpfec'.localeCompare(match) === 0 ||
  //               'rtx'.localeCompare(match) === 0
  //             ) {
  //               if (enhanceData.videoBitrate !== undefined) {
  //                 sdpStrRet +=
  //                   '\r\na=fmtp:' +
  //                   rtpmapID[1] +
  //                   ' x-google-min-bitrate=' +
  //                   enhanceData.videoBitrate +
  //                   ';x-google-max-bitrate=' +
  //                   enhanceData.videoBitrate;
  //               }
  //             }
  //             if (
  //               'opus'.localeCompare(match) === 0 ||
  //               'isac'.localeCompare(match) === 0 ||
  //               'g722'.localeCompare(match) === 0 ||
  //               'pcmu'.localeCompare(match) === 0 ||
  //               'pcma'.localeCompare(match) === 0 ||
  //               'cn'.localeCompare(match) === 0
  //             ) {
  //               if (enhanceData.audioBitrate !== undefined) {
  //                 sdpStrRet +=
  //                   '\r\na=fmtp:' +
  //                   rtpmapID[1] +
  //                   ' x-google-min-bitrate=' +
  //                   enhanceData.audioBitrate +
  //                   ';x-google-max-bitrate=' +
  //                   enhanceData.audioBitrate;
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //     sdpStrRet += '\r\n';
  //   }
  //   console.log('Resuling SDP: ' + sdpStrRet);
  //   return sdpStrRet;
  // };

  // function addAudio(sdpStr: string, audioLine: string) {
  //   let sdpLines = sdpStr.split(/\r\n/);
  //   let sdpStrRet = '';
  //   let done = false;

  //   for (let sdpIndex in sdpLines) {
  //     let sdpLine = sdpLines[sdpIndex];

  //     if (sdpLine.length <= 0) continue;

  //     sdpStrRet += sdpLine;
  //     sdpStrRet += '\r\n';

  //     if ('a=rtcp-mux'.localeCompare(sdpLine) === 0 && done === false) {
  //       sdpStrRet += audioLine;
  //       done = true;
  //     }
  //   }
  //   return sdpStrRet;
  // }

  // function addVideo(sdpStr: string, videoLine: string) {
  //   let sdpLines = sdpStr.split(/\r\n/);
  //   let sdpStrRet = '';
  //   let done = false;

  //   let rtcpSize = false;
  //   let rtcpMux = false;

  //   for (let sdpIndex in sdpLines) {
  //     let sdpLine = sdpLines[sdpIndex];

  //     if (sdpLine.length <= 0) continue;

  //     if (sdpLine.includes('a=rtcp-rsize')) {
  //       rtcpSize = true;
  //     }

  //     if (sdpLine.includes('a=rtcp-mux')) {
  //       rtcpMux = true;
  //     }
  //     // console.log(rtcpMux);
  //   }

  //   for (let sdpIndex in sdpLines) {
  //     let sdpLine = sdpLines[sdpIndex];

  //     sdpStrRet += sdpLine;
  //     sdpStrRet += '\r\n';

  //     if (
  //       'a=rtcp-rsize'.localeCompare(sdpLine) === 0 &&
  //       done === false &&
  //       rtcpSize === true
  //     ) {
  //       sdpStrRet += videoLine;
  //       done = true;
  //     }

  //     if (
  //       'a=rtcp-mux'.localeCompare(sdpLine) === 0 &&
  //       done === true &&
  //       rtcpSize === false
  //     ) {
  //       sdpStrRet += videoLine;
  //       done = true;
  //     }

  //     if (
  //       'a=rtcp-mux'.localeCompare(sdpLine) === 0 &&
  //       done === false &&
  //       rtcpSize === false
  //     ) {
  //       done = true;
  //     }
  //   }
  //   return sdpStrRet;
  // }

  // function deliverCheckLine(profile: string, type: 'audio' | 'video') {
  //   let outputString = '';
  //   for (let line in SDPOutput) {
  //     let lineInUse = SDPOutput[line];
  //     outputString += line;
  //     if (lineInUse.includes(profile)) {
  //       if (profile.includes('VP9') || profile.includes('VP8')) {
  //         let output = '';
  //         let outputs = lineInUse.split(/\r\n/);
  //         for (let position in outputs) {
  //           let transport = outputs[position];
  //           if (
  //             transport.indexOf('transport-cc') !== -1 ||
  //             transport.indexOf('goog-remb') !== -1 ||
  //             transport.indexOf('nack') !== -1
  //           ) {
  //             continue;
  //           }
  //           output += transport;
  //           output += '\r\n';
  //         }

  //         if (type.includes('audio')) {
  //           audioIndex = Number(line);
  //         }

  //         if (type.includes('video')) {
  //           videoIndex = Number(line);
  //         }

  //         return output;
  //       }
  //       if (type.includes('audio')) {
  //         audioIndex = Number(line);
  //       }

  //       if (type.includes('video')) {
  //         videoIndex = Number(line);
  //       }
  //       return lineInUse;
  //     }
  //   }
  //   // console.log('index', audioIndex);
  //   // console.log('index', videoIndex);
  //   return outputString;
  // }

  // function checkLine(line: string) {
  //   if (
  //     line.startsWith('a=rtpmap') ||
  //     line.startsWith('a=rtcp-fb') ||
  //     line.startsWith('a=fmtp')
  //   ) {
  //     let res = line.split(':');

  //     if (res.length > 1) {
  //       let number = res[1].split(' ');

  //       if (!isNaN(Number(number[0]))) {
  //         if (!number[1].startsWith('http') && !number[1].startsWith('ur')) {
  //           let currentString = SDPOutput[number[0]];
  //           if (!currentString) {
  //             currentString = '';
  //           }
  //           currentString += line + '\r\n';
  //           SDPOutput[number[0]] = currentString;
  //           return false;
  //         }
  //       }
  //     }
  //   }

  //   return true;
  // }

  // function getrtpMapID(line: string) {
  //   let findid = new RegExp('a=rtpmap:(\\d+) (\\w+)/(\\d+)');
  //   let found = line.match(findid);
  //   return found && found.length >= 3 ? found : null;
  // }

  return (
    <View style={styles.container}>
      <View style={styles.video}>
        {stream ? (
          <RTCView
            streamURL={stream.toURL()}
            mirror={true}
            style={styles.video}
          />
        ) : (
          <></>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={startPublisher}>
          <Text>방송 시작</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    flexDirection: 'column',
  },
  video: {
    flex: 4,
  },
  footer: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 140,
    width: 100,
    height: 30,
    borderWidth: 1,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default MyPage;
