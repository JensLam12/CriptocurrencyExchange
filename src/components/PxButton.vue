<template>
  <button
    v-on:click="buttonClick"
    class="bg-transparent hover:bg-purple-500 text-purple-700 font-semibold hover:text-white py-2 px-2 border border-pruple-500 hover:border-transparent rounded"
  >
    <LoadingButton v-if="isLoading" />
    <slot v-else></slot>
  </button>
</template>

<script>
import LoadingButton from '@/components/LoadingButton';

  export default{
    name: 'PxButton',
    components: {
      LoadingButton
    },
    methods: {
      buttonClick() {
        this.$emit('custom-click')
      }
    },
    props: {
      isLoading: {
        type: Boolean,
        default: false
      }
    }
  }
</script>