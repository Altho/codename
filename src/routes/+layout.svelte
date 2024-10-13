<script>import "../app.css";
import '../global.css'
import {AppShell} from "@skeletonlabs/skeleton";
import LeftMenu from "$lib/components/layout/leftMenu/LeftMenu.svelte";</script>




<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
    <svelte:fragment slot="header"></svelte:fragment>
    <svelte:fragment slot="sidebarLeft">
        <LeftMenu />
    </svelte:fragment>
    <!-- (sidebarRight) -->
    <!-- (pageHeader) -->
    <!-- Router Slot -->
    <slot />
    <!-- ---- / ---- -->
    <svelte:fragment slot="pageFooter">Page Footer</svelte:fragment>
    <!-- (footer) -->
</AppShell>
