import { Call, CallingState, ParticipantView, StreamCall, StreamTheme, StreamVideo, StreamVideoClient, StreamVideoParticipant, useCall, useCallStateHooks, User } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { useCallback, useEffect, useRef, useState } from 'react';

const apiKey = 'mmhfdzb5evj2';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0RhcnRoX0JhbmUiLCJ1c2VyX2lkIjoiRGFydGhfQmFuZSIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzI2MDczNDE1LCJleHAiOjE3MjY2NzgyMTV9.yRDz2IrjzADrtNWUD46xiHYHT1lYkwPrJDDgpYjdy88';
const userId = 'Darth_Bane';
const callId = 'csb-212eb213fb38d';

// set up the user object
const user: User = {
  id: userId,
  name: 'Herprit',
  image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};



export default function App() {

  const clientRef = useRef<StreamVideoClient|null>(null);
  const callRef = useRef<Call|null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParamsObj:Record<string,string> = {};
    params.forEach((value, key) => {
      searchParamsObj[key] = value;
    });

const newUser = "userName" in searchParamsObj?{...user,name:searchParamsObj.userName}:user;
console.log(searchParamsObj,newUser)
    clientRef.current = new StreamVideoClient({ apiKey, user:newUser, token });
    callRef.current = clientRef.current.call('default', searchParamsObj.callId || callId);
    
    callRef.current.on("call.ended",()=>console.log(1))
    callRef.current.microphone.enable()
    callRef.current.join({ create: true });  
  }, [])

  if(!clientRef.current || !callRef.current) return <div>Loading...</div>;
  
  return (
    <>
    <StreamVideo client={clientRef.current}>
      <StreamCall call={callRef.current}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
    <button onClick={()=>{
      callRef.current!.endCall()
    }}>dskjbfcdsc</button>
    </>
  );
}

export const MyUILayout = () => {
  const {
    useCallCallingState,
    useLocalParticipant,
    useRemoteParticipants,
    // ... other hooks
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  

  if (callingState !== CallingState.JOINED || !localParticipant) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme>
      <MyParticipantList participants={remoteParticipants} />
      <MyFloatingLocalParticipant participant={localParticipant} />
    </StreamTheme>
  );
};

export const MyParticipantList = (props: { participants: StreamVideoParticipant[] }) => {
  const { participants } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
      {participants.map((participant) => (
        <ParticipantView participant={participant} key={participant.sessionId} />
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = (props: { participant: StreamVideoParticipant }) => {
  const { participant } = props;
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '15px',
        width: '240px',
        height: '135px',
        boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 10px 3px',
        borderRadius: '12px',
      }}
    >
      <ParticipantView participant={participant} />
    </div>
  );
};




export const CustomCallRecordButton = () => {
  const call = useCall();
  const { useIsCallRecordingInProgress } = useCallStateHooks();
  const isCallRecordingInProgress = useIsCallRecordingInProgress();
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  console.log(call)
  useEffect(() => {
    if (!call) return;
    // we wait until call.recording_started/stopped event
    // to remove the loading indicator
    const eventHandlers = [
      call.on('call.recording_started', () => setIsAwaitingResponse(false)),
      call.on('call.recording_stopped', () => setIsAwaitingResponse(false)),
    ];
    return () => {
      eventHandlers.forEach((unsubscribe) => unsubscribe());
    };
  }, [call]);

  const toggleRecording = useCallback(async () => {
    try {
      setIsAwaitingResponse(true);
      if (isCallRecordingInProgress) {
        await call?.stopRecording();
      } else {
        await call?.startRecording();
      }
    } catch (e) {
      console.error(`Failed start recording`, e);
    }
  }, [call, isCallRecordingInProgress]);

  return isAwaitingResponse ? (
    <div>Loading...</div>
  ) : (
    <button onClick={toggleRecording}>{/* Button content */}aabcd</button>
  );
};