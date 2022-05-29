import { OWGamesEvents } from '@overwolf/overwolf-api-ts/dist';
import { interestingFeatures } from '../src/consts';
import UnloadingEvent from './unloadingEvent';
import * as fileManager from './filemanager';

type OverwolfHookWindow = typeof window & {
    NWMM_registerEventCallback: typeof onPlayerDataUpdateEvent.register;
}

const FILE_PATH = `${overwolf.io.paths.documents}\\OverwolfAutopath\\position.pos`;
export const positionUpdateRate = 40;

type OnPlayerDataUpdateListener = (info: PlayerData) => void;

const onPlayerDataUpdateEvent = new UnloadingEvent<OnPlayerDataUpdateListener>('onPlayerDataUpdate');

export const registerEventCallback = onPlayerDataUpdateEvent.register;
    //? onPlayerDataUpdateEvent.register
    //: (overwolf.windows.getMainWindow() as OverwolfHookWindow).NWMM_registerEventCallback;
 

//Do something with game data    
function onUpdate(info: any) {
    const playerData = transformData(info);
    
    if (!playerData) {
        return;
    }    
    onPlayerDataUpdateEvent.fire(playerData);   
}


function writeData(data: string) {
    fileManager.readFile().then((str) => {
        const canWrite = fileManager.parseSyncWord(str, ';');
        if(canWrite == 'canwrite' || canWrite == ''){
            console.log("We can write!!");          
            fileManager.writeFile(data);
        }
        else{
            console.log("We can't write file");
        }
    })
}


function transformData(info: any): PlayerData | undefined {
    if (info.success && info.res && info.res.game_info) {
        info = info.res.game_info;
    }

    if (!info.location) {
        return undefined;
    }

    const locationParts = (info.location as string).trim().split(',');
    const position = {
        x: parseFloat(locationParts[1]),
        y: parseFloat(locationParts[3]),
        z: parseFloat(locationParts[5]),
    };

    const rotation = -(parseFloat(locationParts[11]) - 90) * Math.PI / 180;
    writeData(
        position.x + ';' +
        position.y + ';' +
        position.z + ';' +
        locationParts[11] + ';' +
        'canread'
    );
  

    const compass = locationParts[13].trim();
    return {
        position,
        rotation,
        compass,
        map: info.map ? (info.map as string).trim() : undefined,
        name: info.player_name ? (info.player_name as string).trim() : undefined,
        world: info.world_name ? (info.world_name as string).trim() : undefined,
    };
}

//Register events
export function initializeHooks() {
    const listener = new OWGamesEvents({
        onInfoUpdates: onUpdate,
        onNewEvents: onUpdate,
    }, interestingFeatures);
    
    listener.start();
    setInterval(() => overwolf.games.events.getInfo(onUpdate), positionUpdateRate);
    (window as OverwolfHookWindow).NWMM_registerEventCallback = onPlayerDataUpdateEvent.register;
}
