<template>
  <div>
    <crud-table-default styleType="primary"
                          v-if="$route.params.crudId && hasAuth"
                          :crudId="$route.params.crudId">
    </crud-table-default>
    <h1 v-if="!hasAuth" style="margin-top: 20px">无查阅此报表的权限</h1>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import CrudTableDefault from '../../components/CrudTableDefault'
export default {
  name: 'Cruds',
  components: {CrudTableDefault},
  data () {
    return {
      hasAuth: true
    }
  },
  computed: {
    ...mapGetters([
      'crudMenus'
    ])
  },
  watch: {
    '$route' (to, from) {
      let vm = this
      let auth = vm.crudMenus.map(e => e.path)
      console.log('auths: %O, to: %O', auth, to)
      if (auth.findIndex(e => e === to.path) < 0) {
        vm.hasAuth = false
      } else {
        vm.hasAuth = true
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
