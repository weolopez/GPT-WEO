export const html = 
`
<style>
.nav {
    --bs-nav-link-padding-x: 1rem;
    --bs-nav-link-padding-y: 0.5rem;
    --bs-nav-link-font-weight: ;
    --bs-nav-link-color: var(--bs-link-color);
    --bs-nav-link-hover-color: var(--bs-link-hover-color);
    --bs-nav-link-disabled-color: var(--bs-secondary-color);
    display: flex;
    flex-wrap: wrap;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
    overflow: auto;
    white-space: nowrap;
    display: block;
    width: 100vw;
    scrollbar-width: none;
    border-bottom: var(--bs-nav-tabs-border-width) solid var(--bs-nav-tabs-border-color);
}
.nav::-webkit-scrollbar {
    display: none;
  }
.nav-item {
    display: inline-block;
    overflow: auto;
    overflow-y: hidden;
    white-space: nowrap;
    margin-bottom: -8px;
}

.nav-item .nav-link.active {
    background-color: #343541;
    color: #fff;
    border: none;
}
.nav-tabs .nav-link {
    border: none;
    outline: none;

    margin-bottom: calc(-1 * var(--bs-nav-tabs-border-width));
    background: 0 0;
    border: var(--bs-nav-tabs-border-width) solid transparent;
    border-top-left-radius: var(--bs-nav-tabs-border-radius);
    border-top-right-radius: var(--bs-nav-tabs-border-radius);
    display: block;
    padding: var(--bs-nav-link-padding-y) var(--bs-nav-link-padding-x);
    font-size: var(--bs-nav-link-font-size);
    font-weight: var(--bs-nav-link-font-weight);
    color: #fff;
    text-decoration: none;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out;
}
</style>

`

