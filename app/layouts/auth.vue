<template>
  <div class="min-h-screen bg-gradient-to-br from-[#D7E0EF] via-sage-100 to-[#D9E4CF] dark:from-carbon-950 dark:via-carbon-950 dark:to-carbon-900 flex flex-col">
    <header class="flex justify-end p-4">
      <UColorModeButton class="rounded-full bg-white dark:bg-carbon-800 shadow-sm" />
    </header>
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
