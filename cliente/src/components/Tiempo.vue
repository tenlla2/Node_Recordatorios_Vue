<template>
  <div class="container">
    <br>
    
    <div id="tit" class="h1">Proyecto Vue.js- Antonio Tenllado Humanes</div>
    <hr>
     <h1>Tiempo en {{estado.name}}</h1>

            <h2>
              <img :src="icono">
              {{estado.main.temp}}ºC
            </h2>
            


        <hr>

        <div class="row justify-content-center">
          <div class="col-3"><img src="@/assets/max.png"> Tª Max: {{estado.main.temp_max}}ºC</div>
          <div class="col-3"><img src="@/assets/min.png"> Tª Min: {{estado.main.temp_min}}ºC</div>
        </div>
        <div class="row justify-content-center">
          <div class="col-3"><img src="@/assets/humedad.png"> Humedad: {{estado.main.humidity}}%</div>
          <div class="col-3"><img src="@/assets/presion.png"> Presión: {{estado.main.pressure}} mb</div>
        </div>

  </div>

           
</template>

<script>
export default {
  name: "tiempo",
  data: function() {
    return {
      estado: {},
      key: "c945b3bbee9f221e1ec864df3e5bf60d",
      lat: "",
      lon: "",
      icono: "",
    };
  },
  methods: {
    elTiempo: function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.posicion);
      }
    },

    posicion: function(position) {
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      this.Actual();
    },
    Actual() {
      this.axios
        .get(
          "https://api.openweathermap.org/data/2.5/weather?lat=" + this.lat +"&lon=" +this.lon +"&units=metric&appid=" + this.key)
        .then(respuesta => {
          this.estado = respuesta.data;
          this.icono = "https://openweathermap.org/img/w/"+this.estado.weather[0].icon+".png";
          });
    }
  },
  beforeMount() {
    this.elTiempo();
  },
  mounted() {
    setTimeout(this.elTiempo, 30000);
  }
};
</script>

<style scoped>
.row, h1, h2{
  color: white;
}
.col-3{
   border: solid 2px rgb(49, 122, 190);
}
#tit {
  color: white;
}
hr{
  color: white;
}
</style>
