import SpeakerToolbar from "./SpeakerToolbar";
import SpeakerList from "./SpeakerList";
import { SpeakerFilterProvider } from "../context/SpeakerFilterContext"; 

function Speakers() {

    return (
        <SpeakerFilterProvider startingShowSessions={false}>
            <SpeakerToolbar />
            <SpeakerList />
        </SpeakerFilterProvider>
    );
}

export default Speakers;