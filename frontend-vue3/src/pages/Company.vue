<script lang="ts">
// The Company Information Page
import {defineComponent} from "vue";

export default defineComponent({
  name: "Company",

  setup() {}

})
</script>

<template>

  <div class="flex flex-col justify-start h-screen">

    <!-- Top Nav -->
    <nav class="py-4 w-full flex flex-row items-center justify-center bg-indigo_dye-light space-x-8">

      <router-link :to="{ name: 'hero' }" class="font-medium text-gray-100 hover:text-gray-400">Home</router-link>

      <a href="#" class="font-medium text-gray-100 hover:text-gray-400">Features</a>

      <router-link :to="{ name: 'login' }" class="font-medium text-gray-100 hover:text-gray-400">Coach Login</router-link>
    </nav>


    <!-- mission statement and logo -->
    <section class="w-full flex flex-row items-center justify-around pb-8 bg-indigo_dye-light text-white">

      <!-- left Company Mission Statement -->
      <div class="flex flex-col items-center w-1/2">
        <p class="text-3xl p-4">Our Mission</p>
        <p class="">
          At Find-A-Coach, we believe in creating a better world through education. Our network of coaches are skilled in
          a variety of subjects. From IT, to music, to cooking, to... whatever you need. If we don't have a coach for it
          you don't need it!
        </p>
      </div>

      <!-- right -->
      <img class="inline-block" width="128" height="128" src="../assets/whistle.svg" alt="whistle">
<!--      <div class="w-1/2">-->
<!--        -->
<!--      </div>-->

    </section>

    <!-- Testimonials -->
    <section class="pt-16 bg-top-curve-indigo bg-no-repeat bg-cover text-black">
      <p class="pt-16 text-center text-4xl">Testimonials</p>

      <!-- 2-pane testimonial -->
      <div class="m-4 flex flex-row justify-around">

        <!-- card -->
        <div class="m-4 w-3/12 bg-blue-500 border-2 rounded-md border-blue-800">
          <p class="mt-2 mx-4 text-white font-light">"Find-A-Coach helped me to come up to speed with Vue.js and MongoDB. My coach was extremely knowledgeable and friendly. Now I'm running Amazon.com!"</p>
          <div class="m-2 flex flex-row items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/avatars/avatar2.png" alt="customer avatar">
            <div class="text-white">
              <p class="">Bill Hathaway</p>
              <p class="text-indigo-200">Student / Customer</p>
            </div>
          </div>
        </div>

        <!-- card -->
        <div class="m-4 w-3/12 bg-blue-500 border-2 rounded-md border-blue-800">
          <p class="mt-2 mx-4 text-white font-light">
            "I enjoy teaching and sharing my knowledge with people from all over the world! Find-A-Coach has put me in contact with people in need of my help. Plus the cash isn't bad either!"
          </p>
          <div class="m-2 flex flex-row items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/avatars/avatar3.png" alt="customer avatar">
            <div class="text-white">
              <p class="">Elon Bershire</p>
              <p class="text-indigo-200">Coach</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Leadership Section -->
    <section class="mt-16 text-black">
      <p class="my-4 text-center text-black text-4xl font-bold">Our Leadership</p>


      <div class="m-4 flex flex-row justify-around">
        <div class="m-4 w-1/5">

          <p class="mt-2 text-gray-500">
            Our founders hail from a wide range of industries within IT and Education. Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. Ab consequuntur explicabo ipsa modi nihil, perferendis rem veritatis.
            Amet ut, vero?
          </p>
        </div>

        <!-- Founder Pictures and Info -->
        <div class="m-4 w-2/5 grid grid-cols-2 gap-4">
          <div class="flex flex-initial items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/photos/ceo1.jpg" alt="c.e.o.">
            <div class="text-black">
              <p>Gilman Louie</p>
              <p class="text-indigo_dye">Founder / CEO</p>
            </div>
          </div>

          <div class="flex flex-initial items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/photos/cto1.jpg" alt="c.t.o.">
            <div class="text-black">
              <p>Rudy Green</p>
              <p class="text-indigo_dye">CTO</p>
            </div>
          </div>

          <div class="flex flex-initial items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/photos/engineering1.jpg" alt="engineering">
            <div class="text-black">
              <p>Linus Cook</p>
              <p class="text-indigo_dye">V.P. Engineering</p>
            </div>
          </div>

          <div class="flex flex-initial items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/photos/design1.jpg" alt="design">
            <div class="text-black">
              <p>Oswald Buchanon</p>
              <p class="text-indigo_dye">Lead Designer</p>
            </div>
          </div>

          <div class="flex flex-initial items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/photos/sales1.jpg" alt="design">
            <div class="text-black">
              <p>Dewey Cheatem</p>
              <p class="text-indigo_dye">V.P. Sales</p>
            </div>
          </div>

          <div class="flex flex-initial items-center">
            <img class="mx-2 h-16 w-16 rounded-full" src="/photos/morale1.jpg" alt="design">
            <div class="text-black">
              <p>Edsgar Van Lierop</p>
              <p class="text-indigo_dye">Employee Morale</p>
            </div>
          </div>
        </div>

      </div>
    </section>

<!--    &lt;!&ndash; bottom footer, solid color section &ndash;&gt;-->
    <section class="mt-auto h-24 flex flex-row justify-center items-center bg-indigo_dye-light">
      <p class="text-white">Copyright 2002 - Find-A-Coach Inc.</p>
    </section>

  </div>


</template>

<style scoped>

</style>