<template>
    <header class="shadow w-screen">
        <nav>
            <nav class="flex items-center justify-between flex-wrap bg-purple-900 p-6">
                <div class="flex items-center flex-shrink-0 text-white mr-6">
                    <px-icon class="mr-2"/>
                    <router-link :to="{ name: 'home'}" class="font-semibold text-xl tracking-tight">Jelam Exchange</router-link>
                </div>
                <div class="hidden sm:block blok flex-grow lg:flex lg:items-center lg:wauto">
                   <div class="text-sm lg:flex-grow">
                      <router-link 
                        v-for="l in links"
                        :key="l.title"
                        :to="l.to"
                        class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-green-500 mr-4" >
                            {{ l.title}}
                      </router-link>
                   </div>
                </div>
            </nav>
        </nav>
    </header>
</template>

<script>

import PxIcon from '@/components/PxIcon'

export default {
    name: 'PxHeader',
    components: {
        PxIcon
    },
    props: {
        links: {
            type: Array,
            default: () => []
        }
    }
}
</script>
