<template>
    <ClientOnly>
        <Teleport defer to="#__nuxt">
            <input type="checkbox" v-model="_show" class="modal-toggle" />
            <div class="modal" role="dialog">
                <div class="modal-box w-11/12 py-10 bg-transparent shadow-none max-h-screen overflow-hidden flex flex-col justify-center"
                    :class="maxWidth">
                    <div data-theme="light"
                        class="rounded-xl bg-white border-1 p-4 relative shadow-lg shadow-black/40 h-min max-h-full overflow-y-auto ">
                        <div class="modal-top flex justify-end">
                            <button @click="$emit('close')"
                                class="btn btn-xs btn-circle btn-ghost bg-gray-500/60 text-white">
                                <LucideX :size="14" />
                            </button>
                        </div>
                        <slot />
                    </div>
                </div>
                <label class="modal-backdrop" @click="$emit('close')">Close</label>
            </div>
        </Teleport>
    </ClientOnly>
</template>

<script lang="ts" setup>
import { LucideX } from 'lucide-vue-next';

const emit = defineEmits(['close']);

interface Props {
    show: boolean
    maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
    maxWidth: '',
})
const _show = ref<boolean>(false);

watchEffect(() => {
    _show.value = props.show;
})

</script>

<style></style>