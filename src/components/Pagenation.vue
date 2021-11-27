<template>
  <div id="app" class="container">
    <nav>
      <ul class="pagination">
        <li class="page-item">
          <a @click="first" class="page-link" href="#">&laquo;</a>
        </li>
        <li class="page-item">
          <a @click="prev" class="page-link" href="#">&lt;</a>
        </li>

        <li
          v-for="i in displayPageRange"
          class="page-item"
          :class="{ active: i - 1 === currentPage }"
        >
          <a @click="pageSelect(i)" class="page-link" href="#">{{ i }}</a>
        </li>

        <li class="page-item">
          <a @click="next" class="page-link" href="#">&gt;</a>
        </li>
        <li class="page-item">
          <a @click="last" class="page-link" href="#">&raquo;</a>
        </li>
      </ul>
    </nav>
    <ul class="list-group">
      <li v-for="item in displayItems" class="list-group-item">
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>
