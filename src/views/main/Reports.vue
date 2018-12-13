<template>
  <div>
    <report-table-default styleType="primary"
                          v-if="$route.params.reportId && authToReport"
                          :reportId="$route.params.reportId">
    </report-table-default>
    <div v-else style="margin-top: 20px">
      无查阅此报表的权限
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ReportTableDefault from '../../components/ReportTableDefault'
export default {
  name: 'Reports',
  components: {
    ReportTableDefault
  },
  data () {
    return {
      authToReport: true
    }
  },
  computed: {
    ...mapGetters([
      'reportsMenus'
    ])
  },
  watch: {
    '$route' (to, from) {
      let vm = this
      let auth = vm.reportsMenus.map(e => e.path)
      console.log('auths: %O, to: %O', auth, to)
      if (auth.findIndex(e => e === to.path) < 0) {
        vm.authToReport = false
      } else {
        vm.authToReport = true
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
