<template>
  <div class="pie mt-4">
    <div class="row justify-content-center mt-3">
      <div class="col-auto">
        <p class="text-light justify-content-center">
          Desarrollado por Antonio Tenllado Humanes.
          <br>Código disponible en
          <a v-bind:href="url" class="text-success">
            <img src="@/assets/git.png" class="mr-1 mb-1">GitHub
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "pie",
  props: {
    url: String
  }
};
</script>

<style scoped>
p {
  margin: 0px;
  text-align: center;
}
.pie {
  border-top: 1px solid grey;
}
</style>