<template>
  <div>
    <div class="py-6 flex justify-center space-x-2">
      <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
        <li>
          <div class="font-bold text-base btn-active">
            <memory-one theme="outline" size="18" />
            视频模式
          </div>
        </li>
        <li>
          <div
            class="font-bold text-base"
            @click="$router.push({ name: 'MonitorCamera' })"
          >
            <notepad theme="outline" size="18" />
            切换
          </div>
        </li>
      </ul>
      <ul class="menu rounded-box bg-white lg:menu-horizontal Border">
        <li>
          <div class="font-bold text-base" @click="startMonitoring">
            <folder-plus theme="outline" size="18" />
            开始监考
          </div>
        </li>
        <li>
          <div class="font-bold text-base" @click="stopMonitoring">
            <folder-plus theme="outline" size="18" />
            结束监考
          </div>
        </li>
      </ul>
    </div>
  </div>
  <div v-if="!room" id="join"></div>
  <div v-else id="room">
    <div id="room-header">
      <h2 id="room-title">{{ roomName }}</h2>
      <button class="btn btn-danger" id="leave-room-button" @click="leaveRoom">
        Leave Room
      </button>
    </div>
    <div id="layout-container">
      <VideoComponent
        v-if="localTrack"
        :track="localTrack"
        :participantIdentity="participantName"
        :local="true"
      />
      <template
        v-for="remoteTrack of remoteTracksMap.values()"
        :key="remoteTrack.trackPublication.trackSid"
      >
        <VideoComponent
          v-if="remoteTrack.trackPublication.kind === 'video'"
          :track="remoteTrack.trackPublication.videoTrack!"
          :participantIdentity="remoteTrack.participantIdentity"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, type Ref, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  LocalVideoTrack,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomEvent,
} from "livekit-client";
import VideoComponent from "@/components/Main/VideoComponent.vue";
import { _getJoinToken } from "@/apis/livekit";
import { useUserDataStore } from "@/stores/UserData";
const router = useRouter();
const route = useRoute();

const userDataStore = useUserDataStore();

let roomName = ref("Monitor");
const room = ref<Room>();
const livekitURL = "wss://ahutoj-uo7196ti.livekit.cloud";
let livekitToken: string = "";
type TrackInfo = {
  trackPublication: RemoteTrackPublication;
  participantIdentity: string;
};
const localTrack = ref<LocalVideoTrack>();
const remoteTracksMap: Ref<Map<string, TrackInfo>> = ref(new Map());
let participantName = ref();
const startMonitoring = () => {
  joinRoom();
};

const stopMonitoring = () => {
  leaveRoom();
};

async function joinRoom() {
  await _getJoinToken({}, "monitor").then((res: any) => {
    livekitToken = res.Token;
  });
  room.value = new Room();
  room.value.on(
    RoomEvent.TrackSubscribed,
    (
      _track: RemoteTrack,
      publication: RemoteTrackPublication,
      participant: RemoteParticipant
    ) => {
      remoteTracksMap.value.set(publication.trackSid, {
        trackPublication: publication,
        participantIdentity: participant.identity,
      });
    }
  );
  room.value.on(
    RoomEvent.TrackUnsubscribed,
    (_track: RemoteTrack, publication: RemoteTrackPublication) => {
      remoteTracksMap.value.delete(publication.trackSid);
    }
  );
  try {
    room.value.connect(livekitURL, livekitToken);
    await room.value.localParticipant.enableCameraAndMicrophone();
    localTrack.value = room.value.localParticipant.videoTrackPublications
      .values()
      .next().value!.videoTrack;
  } catch (error: any) {
    console.log("There was an error connecting to the room:", error.message);
    await leaveRoom();
  }
}
async function leaveRoom() {
  await room.value?.disconnect();
  room.value = undefined;
  localTrack.value = undefined;
  remoteTracksMap.value.clear();

  window.removeEventListener("beforeunload", leaveRoom);
}
onUnmounted(() => {
  leaveRoom();
});
</script>
<style scoped>
#join {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#join-dialog {
  width: 70%;
  max-width: 900px;
  padding: 60px;
  border-radius: 6px;
  background-color: #f0f0f0;
}

#join-dialog h2 {
  color: #4d4d4d;
  font-size: 60px;
  font-weight: bold;
  text-align: center;
}

#join-dialog form {
  text-align: left;
}

#join-dialog label {
  display: block;
  margin-bottom: 10px;
  color: #0088aa;
  font-weight: bold;
  font-size: 20px;
}

.form-control {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
  color: #0088aa;
  font-weight: bold;
}

.form-control:focus {
  color: #0088aa;
  border-color: #0088aa;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(0, 136, 170, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(0, 136, 170, 0.6);
}

#join-dialog button {
  display: block;
  margin: 20px auto 0;
}

.btn {
  font-weight: bold;
}

.btn-success {
  background-color: #06d362;
  border-color: #06d362;
}

.btn-success:hover {
  background-color: #1abd61;
  border-color: #1abd61;
}

#room {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#room-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  padding: 0 20px;
  margin-bottom: 20px;
}

#room-title {
  font-size: 2em;
  font-weight: bold;
  margin: 0;
}

#layout-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 10px;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1000px;
  height: 100%;
}

/* Media Queries */
@media screen and (max-width: 768px) {
  #join-dialog {
    width: 90%;
    padding: 30px;
  }

  #join-dialog h2 {
    font-size: 50px;
  }

  #layout-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media screen and (max-width: 480px) {
  #join-dialog {
    width: 100%;
    padding: 20px;
  }

  #join-dialog h2 {
    font-size: 40px;
  }

  #layout-container {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>
