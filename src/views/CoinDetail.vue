<template>
    <div class="flex-col">
        <div class="flex justify-center my-20" v-if="isLoading == true">
            <Loading />
        </div>
            
        <div class="flex-col" v-if="!isLoading">

            <div class="flex flex-col sm:flex-row justify-around items-center" >
                <div class="flex flex-col items-center">
                    <img
                        :src="
                        `https://static.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png`
                        "
                        :alt="asset.name"
                        class="w-20 h-20 mr-5"
                    />
                    <h1 class="text-5xl">
                        {{ asset.name }}
                        <small class="sm:mr-2 text-gray-500">{{ asset.symbol }}</small>
                    </h1>
                </div>

                <div class="my-10 flex flex-col">
                    <ul>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Ranking</b>
                            <span>#{{ asset.rank }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio actual</b>
                            <span>{{ dollarFilter(asset.priceUsd) }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio más bajo</b>
                            <span>{{ dollarFilter(min) }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio más alto</b>
                            <span>{{ dollarFilter(max) }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Precio Promedio</b>
                            <span>{{ dollarFilter(avg) }}</span>
                        </li>
                        <li class="flex justify-between">
                            <b class="text-gray-600 mr-10 uppercase">Variación 24hs</b>
                            <span>{{ percentFilter( asset.changePercent24Hr)}}</span>
                        </li>
                    </ul>
                </div>

                <div class="my-10 sm:mt-0 flex flex-col justify-center text-center">
                    <button
                        @click="toggleConverter"
                        class="bg-purple-700 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded"
                    >
                        {{ fromUsd ? `USD a ${asset.symbol}` : `${asset.symbol} a USD` }}
                    </button>

                    <div class="flex flex-row my-5">
                        <label class="w-full" for="convertValue">
                            <input
                                id="convertValue"
                                type="number"
                                class="text-center bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
                                v-model="convertValue"
                                :placeholder="`Valor en ${fromUsd ? 'USD' : asset.symbol}`"
                            />
                        </label>
                    </div>

                    <span class="text-xl">{{convertResult}} {{ fromUsd ? `${asset.symbol}` : 'USD' }}</span>
                </div>
            </div>

            <line-chart class="my-10"
                :colors="['purple']"
                :min="min"
                :max="max"
                :data = "history.map( h => [h.date, parseFloat(h.priceUsd).toFixed(2) ])"
            />

            <h3 class="text-xl my-10">Mejores ofertas de cambio</h3>
            <table class="container">
                <tr v-for="market in markets" :key="`${market.exchangedId}-${market.piceUsd}`" class="border-b">
                    <td>
                        <b>{{ market.exchangedId}}</b>
                    </td>
                    <td>{{ dollarFilter(market.priceUsd) }}</td>
                    <td>{{ market.baseSymbol}} / {{ market.quoteSymbol}}</td>
                    <td>
                        <px-button 
                            :is-loading="market.isLoading || false" 
                            v-if="!market.url" 
                            @custom-click="getWebsite(market)"> 
                            <slot>Obtener Link</slot>
                        </px-button>
                        <a v-else class="hover: underline text-purple-600" target="_blanck" > {{ market.url}} </a>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import { dollarFilter, percentFilter} from '@/filters'
import Loading from '@/components/Loading';
import PxButton from '@/components/PxButton.vue';

export default {
    name: 'CoinDetail',
    components: {
        Loading,
        PxButton
    },
    data() {
        return{
            asset: {},
            history: {},
            markets: {},
            isLoading: false,
            fromUsd: true,
            convertValue: null
        }
    },
    computed: {
        min() {
            return Math.min(
                ...this.history.map( (h) => parseFloat(h.priceUsd).toFixed(2))
            )
        },
        max() {
            return Math.max(
                ...this.history.map( (h) => parseFloat(h.priceUsd).toFixed(2))
            )
        },
        avg() {
            return this.history.reduce((a, b) => a + parseFloat(b.priceUsd), 0) / this.history.length
        },
        convertResult() {
            if( !this.convertValue) {
                return 0.0000
            }

            const result = this.fromUsd ? this.convertValue / this.asset.priceUsd : this.convertValue * this.asset.priceUsd
            return result.toFixed(2);
        }
    },
    created() {
        this.getCoin()
    },
    setup() {
      return {
        dollarFilter,
        percentFilter
      }
    },
    methods: {
        getCoin() {
            this.isLoading = true
            const id = this.$route.params.id
            Promise.all([
                api.getAsset(id),
                api.getAssetHistory(id),
                api.getMarkets(id),
            ])
            .then(([asset, history, markets]) => {
                this.asset = asset
                this.history = history
                this.markets = markets
            })
            .finally( () => this.isLoading = false)
        },
        getWebsite(exchange) {
            exchange.isLoading = true
            return api.getExchange(exchange.exchangeId).then( res => {
                exchange.url = res.exchangeUrl
            }).finally( () => {
                exchange.isLoading = false
            })
        },
        toggleConverter() {
            this.fromUsd = !this.fromUsd
        }
    },
    watch: {
        $route() {
            this.getCoin()
        }
    }
}
</script>

<style scoped>
    td{
        padding: 0.5rem;
        text-align: center;
    }
</style>