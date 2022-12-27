<script>
    export let width = 100;
    export let height = 50;
    export let src;
    export let alt = "";
    export let caption = "";

    import { onMount } from 'svelte'
    import IntersectionObserver from './IntersectionObserver.svelte'
    import Image from './Image.svelte'
    let nativeLoading = false

    // Determine whether to bypass our intersecting check
    onMount(() => {
       if ('loading' in HTMLImageElement.prototype) {
         nativeLoading = true
       }
     })
  
</script>

<div class="center">
    <IntersectionObserver once={true} let:intersecting={intersecting}>
        {#if intersecting || nativeLoading}
            <figure>
                <Image src={src} alt={alt} width={width} height={height} loading="lazy" />
                <figcaption>{caption}</figcaption>
            </figure>
        {/if}
    </IntersectionObserver>
</div>


<style>

figure figcaption {
    text-align: center;
}

.center {
  background-size: contains;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: var(--scaling);
}

</style>

