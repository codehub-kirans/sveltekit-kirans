<script>
    export let width = 100;
    export let height = 50;
    export let src;
    export let alt = "";
    export let caption = "";
</script>

<div class="center">
<figure>
    <img src={src} alt={alt} width={width} height={height} loading="lazy" />
    <figcaption>{caption}</figcaption>
</figure>
</div>


<style>

figure img {
    vertical-align: top;
}

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