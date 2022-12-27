<script>
    import QRCode from 'qrcode';
    import LazyImageLoader from '$lib/components/LazyImageLoader.svelte';
  
    let qrCodeUrl;
    let qrText = '';
  
    function generateQRCode(text) {
      QRCode.toDataURL(text, function(err, url) {
        qrCodeUrl = url;
      });
    }
</script>

<h1>QR Code Generator</h1>
  
<input type="text" bind:value={qrText} placeholder="Enter text to generate QR code" />
<button on:click={() => generateQRCode(qrText)}>Generate QR Code</button>

{#if qrCodeUrl}
  <LazyImageLoader 
    src={qrCodeUrl} 
    caption="QRCode for {qrText}" 
    alt="QRCode for {qrText}" aria-label="Generated QRCode" 
    width="234" height="218" --scaling="75%" 
  />
{/if}