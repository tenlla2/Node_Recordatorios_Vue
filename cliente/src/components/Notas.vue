<template>
  <div class="container">
    <br>

    <div id="tit" class="h1">Proyecto Vue.js- Antonio Tenllado Humanes</div>
    <div class="form-group" v-if="!estado">
      <input
        type="text"
        placeholder="Introduce un Nick"
        class="form-control"
        v-model="nick"
        @keyup.enter="anadeNick"
      >
    </div>
    <div v-if="estado">
      <div class="form-group">
        <input
          type="text"
          placeholder="¿Qué quieres recordar?"
          class="form-control"
          v-model="nombre"
          @keyup.enter="anadir"
        >
      </div>
      <div class="form-group">
        <input type="text" placeholder="Filtra notas:" class="form-control" v-model="busqueda">
      </div>
      <hr>
      <small class="textopeque">
        <img class="mr-1" src="@/assets/barras.png">
        {{tareasPendientes}} Tareas pendientes de un total de {{this.tareas.length}}
      </small> ||
      <small id="comple" @click="borraCompletadas">X Borrar tareas completadas</small>

      <hr>

      <ul class="list-group">
        <transition-group name="task-list" tag="div">
          <li
            class="list-group-item task-list-item"
            v-for="(tarea,index) in tareasPorPrioridad"
            :key="tarea.fecha.toString()"
          >
            <div class="row">
              <input class="checkbox-circle" type="checkbox" v-model="tarea.completada">
              <h1
                v-bind:class="[{completado : tarea.completada},'col-11','d-flex justify-content-start']"
              >{{tarea.nombre}}</h1>
              <button id="borra" class="btn btn-danger" @click="borrar(index)">
                <img class src="@/assets/cerrar.png">
              </button>
            </div>
            <div class="row">
              <div class="col-auto justify-self-start">
                <small>Prioridad:</small>
                <button
                  type="button"
                  :class="['btn btn-sm py-0 px-1', tarea.prioridad==1 ? ['b1','btn btn-info'] : 'desactivado',]"
                  @click="prioridad(index,'1')"
                >
                  <img class="mr-1" src="@/assets/baja.png">Low
                </button>
                <button
                  :class="['btn btn-sm py-0 px-1', tarea.prioridad==2 ? ['b1','btn btn-primary'] : 'desactivado']"
                  @click="prioridad(index,'2')"
                >Normal</button>
                <button
                  :class="['btn btn-sm py-0 px-1', tarea.prioridad==3 ? ['b1','btn btn-danger'] : 'desactivado']"
                  @click="prioridad(index,'3')"
                >
                  <img class="mr-1" src="@/assets/alta.png">High
                </button>
                <small>
                  <img src="@/assets/hora.png">
                  Añadido hace {{tarea.fecha | moment("from", "now", true)}} ago
                </small>
                <small>Creado por: {{tarea.creador}}</small>
                <br> <br>
                <div class="row">
                  <div class="col-12">
                    <file-pond
                    name="test"
                    ref="pond"
                    label-idle="Arrastra aquí el archivo..."
                    allow-multiple="false"
                    accepted-file-types="image/jpeg, image/png,image/jpg"
                    allowImagePreview="false"
                    server
                    v-bind:files="myFiles"
                    v-on:init="handleFilePondInit"
                  />
                  </div>
                  
                </div>
              </div>
            </div>
          </li>
        </transition-group>
      </ul>
      <div>
      <beautiful-chat
        :participants="participants"
        :titleImageUrl="titleImageUrl"
        :onMessageWasSent="onMessageWasSent"
        :messageList="messageList"
        :newMessagesCount="newMessagesCount"
        :isOpen="isChatOpen"
        :close="closeChat"
        :open="openChat"
        :showEmoji="true"
        :showFile="true"
        :showTypingIndicator="showTypingIndicator"
        :colors="colors"
        :alwaysScrollToBottom="alwaysScrollToBottom"
        :messageStyling="messageStyling"
      />
    </div>
    </div>
    
  </div>
</template>

<script>
import vueFilePond from "vue-filepond";

// Import plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js";
import FilePondPluginImagePreview from "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js";

// Import styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Create FilePond component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview
);

export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  sockets: {
    NuevaTarea: function(nueva) {
      this.tareas = JSON.parse(nueva);
    },
    Notas: function(notas) {
      this.tareas = JSON.parse(notas);
    },

    NuevoNick: function(datos) {
      if (datos.estado) {
        this.estado = true;
        this.creador = datos.nick;
        this.messageList.push(JSON.parse(datos.ChatUsuarios));
      }
    },

    UsuariosChat: function(data){
      this.participants= JSON.parse(data);
    },
    Inicio: function(notas) {
      this.tareas = JSON.parse(notas);
    },

  },
  data() {
    return {
      myFiles: [],
      tareas: [],
      nombre: "",
      busqueda: "",
      nick: "",
      cont:1,
      estado: false,
      creador: "",
      participants: [], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
      titleImageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
      messageList: [
          { type: 'text', author: `me`, data: { text: `Say yes!` } },
          { type: 'text', author: `user1`, data: { text: `No.` } }
      ], // the list of the messages to show, can be paginated and adjusted dynamically
      newMessagesCount: 0,
      isChatOpen: false, // to determine whether the chat window should be open or closed
      showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
      colors: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        launcher: {
          bg: '#4e8cff'
        },
        messageList: {
          bg: '#ffffff'
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff'
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222'
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867'
        }
      }, // specifies the color scheme for the component
      alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
      messageStyling: true // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)
    }
  },
  methods: {
    handleFilePondInit: function() {
      console.log("FilePond has initialized");

      // example of instance method call on pond reference
    },
    anadeNick: function() {
      (this.user = {
        nick: this.nick,
        estado: false
      }),
        this.$socket.emit("NuevoNick", this.user);
      this.nick = "";
    },

    anadir: function() {
      this.nueva = {
        nombre: this.nombre,
        completada: false,
        prioridad: "1",
        fecha: new Date(),
        creador: this.creador
      };
      this.tareas.push(this.nueva);
      this.$socket.emit("NuevaTarea", JSON.stringify(this.nueva));
      this.nombre = "";
    },
    borrar: function(index) {
      this.tareas.splice(index, 1);
      this.$socket.emit("Notas", JSON.stringify(this.tareas));
    },
    borraCompletadas: function() {
      this.tareas = this.tareas.filter(tarea => !tarea.completada);
      this.$socket.emit("Notas", JSON.stringify(this.tareas));
    },
    prioridad: function(index, n) {
      this.tareas[index].prioridad = n;
      this.$socket.emit("Notas", JSON.stringify(this.tareas));
    },
    //chat
    sendMessage (text) {
      if (text.length > 0) {
        this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1;
        this.onMessageWasSent({ author: 'me', type: 'text', data: { text } });
        this.$socket.emit("Mensaje", JSON.stringify({ author: this.creador, type: 'text', data: { text } }));
      }
    },
    onMessageWasSent (message) {
      // called when the user sends a message
      this.messageList = [ ...this.messageList, message ]
    },
    openChat () {
      // called when the user clicks on the fab button to open the chat
      this.isChatOpen = true
      this.newMessagesCount = 0
    },
    closeChat () {
      // called when the user clicks on the botton to close the chat
      this.isChatOpen = false
    }
  },

  computed: {
    tareasPendientes: function() {
      return this.tareas.filter(tarea => !tarea.completada).length;
    },
    tareasPorPrioridad: function() {
      return this.tareas
        .sort((a, b) => b.prioridad - a.prioridad)
        .filter(tarea =>
          tarea.nombre.toLowerCase().startsWith(this.busqueda.toLowerCase())
        );
    }

    //filepond
  },

  components: {
    FilePond
  }
};
</script>

<style scoped>
li {
  cursor: pointer;
}
.completado {
  text-decoration: line-through;
  color: rgb(17, 185, 129);
}
.desactivado {
  background: #646363;
  margin-right: 10px;
}

small {
  color: grey;
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 10px;
}
li {
  color: white;
  background: #3a3939;
  border: solid 1px white;
}

.b1 {
  margin-right: 10px;
}

.b2 {
  margin-right: 10px;
}
.b3 {
  margin-right: 10px;
}
.textopeque {
  color: white;
}
#comple {
  cursor: pointer;
  color: rgb(255, 145, 0);
}
#tit {
  color: white;
}
.task-list-item {
  transition: all 1s;
}

.task-list-enter,
.task-list-leave-to {
  opacity: 0;
  transform: translateX(500px);
}

.task-list-move {
  transition: transform 1s;
}
#borra {
  height: 40px;
}
</style>

