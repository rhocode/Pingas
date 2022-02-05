import produce from "immer";

const ping = async () => {
    const host = "https://1.1.1.1"
    const controller = new AbortController()

    // 2 second timeout:
    const timeoutId = setTimeout(() => controller.abort(), 1000)
    const start = new Date().getTime();
    await fetch(host, { mode: "no-cors", signal: controller.signal });
    const end = new Date().getTime() - start;
    clearTimeout(timeoutId);
    // TODO: find better way
    if (end < 2000) {
        console.log("Pinged with ping", end);
        return end;
    } else {
        console.log("Pinged failed");
        return -1
    }
}

const createDateStr = (date: Date) => {
   return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+'-'+date.getHours();
}

export const createInitialState = () => {
    const now = new Date();
    const stateMap = {} as Record<string, any>;
    for (let i = 23; i >= 0; i--) {
        now.setHours(now.getHours() - 1);
        stateMap[createDateStr(now)] = {
            success: 0,
            failure: 0
        };
    }

    return {
        data: stateMap,
        signals: []
    };
}

interface HourBucket {
    success: number;
    failure: number;
}

interface TimeData {
    data: Record<string, HourBucket>;
    signals: number[];
}

export const updateState = async (state: TimeData): Promise<TimeData> => {
    const pingValue = await ping();

    return produce(state, (draftState: any) => {
        const key = createDateStr(new Date())

        if (!draftState.data[key]) {
            draftState.data[key] = {
                success: 0,
                failure: 0
            }
            const oldDate = new Date();
            oldDate.setHours(oldDate.getHours() - 24);
            delete draftState.data[createDateStr(oldDate)]
        }

        const obj = draftState.data[key];

        if (pingValue >= 0) {
            obj.success++;
        } else {
            obj.failure++;
        }
        draftState.signals.push(pingValue >= 0 ? pingValue : -1)
        while (draftState.signals.length > 120) {
            draftState.signals.shift();
        }
    })
}