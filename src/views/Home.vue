<template>
    <div>
        <Loading v-if="isLoading == true"/>
        <px-assets-table :assets='assets' v-if="!isLoading"/>
    </div>
</template>

<script>
import api from '@/api';
import PxAssetsTable from '@/components/PxAssetsTable';
import Loading from '@/components/Loading';

export default {
    components: { 
        PxAssetsTable,
        Loading 
    },
    name: "Home",

    data() {
        return{
            assets: [],
            isLoading: true,
            interval: null
        }
    },

    created() {
        this.isLoading = true
        api.getAssets().then( assets => (this.assets = assets)).finally( () => this.isLoading = false)
        this.refreshFetch();
    },
    methods: {
        refreshFetch() {
            this.interval = setInterval( async() => {
                api.getAssets().then( assets => (this.assets = assets)).finally( () => this.isLoading = false)
            },5000)
        },
        beforeDestroy(){
            clearInterval( this.interval)
        }
    }
}
</script>
