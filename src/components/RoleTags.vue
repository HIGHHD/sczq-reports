<template>
  <div style="width: 100%; display: inline-block">
    <Tag v-for="(item, index) in allTags"
         v-if="item.havThis"
         :name="item.roleId"
         :key="index"
         color="green">{{ item.roleName }}</Tag>
    <slot name="btn"></slot>
  </div>
</template>

<script>
export default {
  name: 'RoleTags',
  props: {
    tags: {
      type: String,
      default () {
        return ''
      }
    },
    propAllTags: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    allTags: function () {
      let vm = this
      let returnTags = vm.propAllTags
      let myTags = vm.tags.split(',')
      returnTags.forEach((item, index, arr) => {
        item.havThis = false
        console.log('one%O', item)
        let fIndex = myTags.findIndex((mt) => {
          console.log('mt' + mt)
          return (mt === (item.roleId + ''))
        })
        console.log('alltags' + fIndex)
        if (fIndex >= 0) {
          item.havThis = true
        }
      })
      return returnTags
    }
  },
  data () {
    return {
    }
  }
}
</script>

<style scoped>

</style>
